import * as StellarSdk from "@stellar/stellar-sdk";
import { config, horizon } from "./stellar";

export interface PaymentResult {
  hash: string;
  ledger: number;
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

export async function buildPaymentTx(
  sourceAddress: string,
  destinationAddress: string,
  amount: string,
): Promise<string> {
  const account = await horizon.loadAccount(sourceAddress);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(),
        amount,
      }),
    )
    .setTimeout(180)
    .build();

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
