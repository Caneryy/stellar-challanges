import { useState, type FormEvent } from "react";
import {
  getSuccessMessage,
  getTransactionErrorMessage,
  prepareSendPayment,
  submitPayment,
  validatePaymentInput,
} from "../lib/transactions";
import { getExplorerTxUrl } from "../lib/stellar";
import { SendSuccessResult } from "./SendSuccessResult";
import { TransactionFeedback, type TransactionStatus } from "./TransactionFeedback";

interface SendPaymentFormProps {
  address: string | null;
  isTestnet: boolean;
  disabled: boolean;
  onSuccess: () => void;
  sign: (xdr: string) => Promise<string>;
}

interface SentPaymentDetails {
  amount: string;
  destination: string;
}

export function SendPaymentForm({
  address,
  isTestnet,
  disabled,
  onSuccess,
  sign,
}: SendPaymentFormProps) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);
  const [sentPayment, setSentPayment] = useState<SentPaymentDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetSuccess = () => {
    setStatus("idle");
    setMessage(null);
    setTxHash(null);
    setExplorerUrl(null);
    setSentPayment(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address) {
      return;
    }

    const validationError = validatePaymentInput(address, destination, amount);
    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }

    if (!isTestnet) {
      setStatus("error");
      setMessage("Switch Freighter to Testnet.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setMessage(null);
    setTxHash(null);
    setExplorerUrl(null);
    setSentPayment(null);

    const trimmedDestination = destination.trim();
    const trimmedAmount = amount.trim();

    try {
      setStatus("building");
      setMessage("Preparing...");
      const prepared = await prepareSendPayment(address, trimmedDestination, trimmedAmount);

      setStatus("signing");
      setMessage("Confirm in Freighter...");
      const signedXdr = await sign(prepared.xdr);

      setStatus("submitting");
      setMessage("Submitting...");
      const result = await submitPayment(signedXdr);

      setStatus("success");
      setMessage(getSuccessMessage(prepared.operation));
      setTxHash(result.hash);
      setExplorerUrl(getExplorerTxUrl(result.hash));
      setSentPayment({ amount: trimmedAmount, destination: trimmedDestination });
      setDestination("");
      setAmount("");
      onSuccess();
    } catch (error) {
      setStatus("error");
      setMessage(getTransactionErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccess =
    status === "success" &&
    sentPayment &&
    txHash &&
    explorerUrl &&
    message;

  if (showSuccess) {
    return (
      <SendSuccessResult
        message={message}
        amount={sentPayment.amount}
        destination={sentPayment.destination}
        txHash={txHash}
        explorerUrl={explorerUrl}
        onSendAnother={resetSuccess}
      />
    );
  }

  return (
    <div className="space-y-3">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-ink-muted)]">
            Destination
          </span>
          <input
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="GABC...WXYZ"
            disabled={disabled || isSubmitting}
            className="w-full rounded-xl border-2 border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] px-3 py-2.5 font-mono text-sm outline-none focus:border-[color:var(--color-accent)] disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-ink-muted)]">
            Amount
          </span>
          <div className="flex overflow-hidden rounded-xl border-2 border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] focus-within:border-[color:var(--color-accent)]">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="1"
              disabled={disabled || isSubmitting}
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-semibold outline-none disabled:opacity-50"
            />
            <span className="flex items-center border-l border-[color:var(--color-paper-dark)] px-3 text-xs text-[color:var(--color-ink-muted)]">
              XLM
            </span>
          </div>
        </label>

        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="w-full rounded-xl bg-[color:var(--color-ink)] py-3 text-sm font-semibold text-white disabled:opacity-45"
        >
          {isSubmitting ? "Sending..." : "Send Payment"}
        </button>
      </form>

      <TransactionFeedback status={status} message={message} />
    </div>
  );
}
