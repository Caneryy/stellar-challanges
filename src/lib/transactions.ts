import * as StellarSdk from "@stellar/stellar-sdk";
import { config, horizon } from "./stellar";

export interface PaymentResult {
  hash: string;
  ledger: number;
}

export type SendPaymentOperation = "payment" | "createAccount";

export interface PreparedSendPayment {
  operation: SendPaymentOperation;
  xdr: string;
  summary: string;
}

const MIN_CREATE_ACCOUNT_BALANCE = 1;
const BASE_FEE_XLM = Number(StellarSdk.BASE_FEE) / 10_000_000;
const MIN_ACCOUNT_BALANCE_XLM = 1;

const OPERATION_ERROR_MESSAGES: Record<string, string> = {
  op_no_destination:
    "Destination account does not exist on testnet. Send at least 1 XLM to create it.",
  op_underfunded: "Insufficient XLM balance to complete this payment.",
  op_overpayment: "Payment amount exceeds the allowed limit.",
  op_line_full: "Destination account cannot receive this asset.",
};

export async function doesAccountExist(address: string): Promise<boolean> {
  try {
    await horizon.loadAccount(address);
    return true;
  } catch (error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status === 404) {
      return false;
    }

    throw error;
  }
}

export function validatePaymentInput(
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
): string | null {
  if (!StellarSdk.StrKey.isValidEd25519PublicKey(destinationAddress)) {
    return "Enter a valid Stellar destination address.";
  }

  if (destinationAddress === sourceAddress) {
    return "Destination address must be different from your wallet.";
  }

  const parsedAmount = Number(amount);
  if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return "Enter a valid amount greater than 0.";
  }

  if (!/^\d+(\.\d{1,7})?$/.test(amount.trim())) {
    return "Amount can have at most 7 decimal places.";
  }

  return null;
}

function getRequiredSourceBalance(
  amount: string,
  operation: SendPaymentOperation,
): number {
  const parsedAmount = Number(amount);

  if (operation === "createAccount") {
    return parsedAmount + BASE_FEE_XLM + MIN_ACCOUNT_BALANCE_XLM;
  }

  return parsedAmount + BASE_FEE_XLM + MIN_ACCOUNT_BALANCE_XLM;
}

async function validateSourceBalance(
  sourceAddress: string,
  amount: string,
  operation: SendPaymentOperation,
): Promise<string | null> {
  const account = await horizon.loadAccount(sourceAddress);
  const nativeBalance = account.balances.find(
    (balance) => balance.asset_type === "native",
  );
  const sourceBalance = Number(nativeBalance?.balance ?? 0);
  const requiredBalance = getRequiredSourceBalance(amount, operation);

  if (sourceBalance < requiredBalance) {
    return `Insufficient XLM balance. You need at least ${requiredBalance.toFixed(7)} XLM available in your wallet for this ${operation === "createAccount" ? "account creation" : "payment"}.`;
  }

  return null;
}

export async function prepareSendPayment(
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
): Promise<PreparedSendPayment> {
  const trimmedDestination = destinationAddress.trim();
  const trimmedAmount = amount.trim();
  const destinationExists = await doesAccountExist(trimmedDestination);
  const operation: SendPaymentOperation = destinationExists
    ? "payment"
    : "createAccount";

  if (!destinationExists && Number(trimmedAmount) < MIN_CREATE_ACCOUNT_BALANCE) {
    throw new Error(
      `Destination account does not exist on testnet. Send at least ${MIN_CREATE_ACCOUNT_BALANCE} XLM to create it with Send Payment.`,
    );
  }

  const sourceBalanceError = await validateSourceBalance(
    sourceAddress,
    trimmedAmount,
    operation,
  );
  if (sourceBalanceError) {
    throw new Error(sourceBalanceError);
  }

  const sourceAccount = await horizon.loadAccount(sourceAddress);
  const builder = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  });

  if (operation === "payment") {
    builder.addOperation(
      StellarSdk.Operation.payment({
        destination: trimmedDestination,
        asset: StellarSdk.Asset.native(),
        amount: trimmedAmount,
      }),
    );
  } else {
    builder.addOperation(
      StellarSdk.Operation.createAccount({
        destination: trimmedDestination,
        startingBalance: trimmedAmount,
      }),
    );
  }

  const summary =
    operation === "payment"
      ? `Sending ${trimmedAmount} XLM to an existing account.`
      : `Creating a new account and funding it with ${trimmedAmount} XLM.`;

  return {
    operation,
    xdr: builder.setTimeout(180).build().toXDR(),
    summary,
  };
}

export async function submitPayment(signedXdr: string): Promise<PaymentResult> {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    config.networkPassphrase,
  ) as StellarSdk.Transaction;

  const response = await horizon.submitTransaction(transaction);

  return {
    hash: response.hash,
    ledger: response.ledger,
  };
}

export function getSuccessMessage(operation: SendPaymentOperation): string {
  if (operation === "createAccount") {
    return "New account created and funded successfully.";
  }

  return "Payment sent successfully.";
}

export function getTransactionErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const horizonError = error as Error & {
      response?: {
        data?: {
          detail?: string;
          extras?: {
            result_codes?: {
              transaction?: string;
              operations?: string[];
            };
          };
        };
      };
    };

    const resultCodes = horizonError.response?.data?.extras?.result_codes;
    if (resultCodes?.operations?.length) {
      const operationCode = resultCodes.operations[0];
      const friendlyMessage = OPERATION_ERROR_MESSAGES[operationCode];
      if (friendlyMessage) {
        return friendlyMessage;
      }

      return `Transaction failed: ${resultCodes.operations.join(", ")}`;
    }

    if (resultCodes?.transaction) {
      return `Transaction failed: ${resultCodes.transaction}`;
    }

    if (horizonError.response?.data?.detail) {
      return horizonError.response.data.detail;
    }

    if (error.message.toLowerCase().includes("user declined")) {
      return "Transaction cancelled in Freighter.";
    }

    return error.message;
  }

  return "An unexpected error occurred.";
}
