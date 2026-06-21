import * as StellarSdk from "@stellar/stellar-sdk";
import { config, horizon } from "./stellar";

export interface PaymentResult {
  hash: string;
  ledger: number;
}

const MIN_CREATE_ACCOUNT_BALANCE = 1;

const OPERATION_ERROR_MESSAGES: Record<string, string> = {
  op_no_destination:
    "Destination account does not exist on testnet. Fund it first or send at least 1 XLM to create it.",
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

  return null;
}

export async function validateDestinationAccount(
  destinationAddress: string,
  amount: string,
): Promise<string | null> {
  const destinationExists = await doesAccountExist(destinationAddress);
  if (destinationExists) {
    return null;
  }

  const parsedAmount = Number(amount);
  if (parsedAmount < MIN_CREATE_ACCOUNT_BALANCE) {
    return `Destination account does not exist on testnet. Send at least ${MIN_CREATE_ACCOUNT_BALANCE} XLM to create it, or fund the address with Friendbot first.`;
  }

  return null;
}

export async function buildPaymentTx(
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
): Promise<string> {
  const account = await horizon.loadAccount(sourceAddress);
  const destinationExists = await doesAccountExist(destinationAddress);

  const builder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  });

  if (destinationExists) {
    builder.addOperation(
      StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(),
        amount,
      }),
    );
  } else {
    builder.addOperation(
      StellarSdk.Operation.createAccount({
        destination: destinationAddress,
        startingBalance: amount,
      }),
    );
  }

  const transaction = builder.setTimeout(180).build();

  return transaction.toXDR();
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
