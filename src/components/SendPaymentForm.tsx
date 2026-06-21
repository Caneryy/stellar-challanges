import { useState, type FormEvent } from "react";
import {
  getSuccessMessage,
  getTransactionErrorMessage,
  prepareSendPayment,
  submitPayment,
  type SendPaymentOperation,
  validatePaymentInput,
} from "../lib/transactions";
import { getExplorerTxUrl } from "../lib/stellar";
import { TransactionFeedback, type TransactionStatus } from "./TransactionFeedback";

interface SendPaymentFormProps {
  address: string | null;
  isTestnet: boolean;
  disabled: boolean;
  onSuccess: () => void;
  sign: (xdr: string) => Promise<string>;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOperation, setLastOperation] = useState<SendPaymentOperation | null>(
    null,
  );

  const resetFeedback = () => {
    setStatus("idle");
    setMessage(null);
    setTxHash(null);
    setExplorerUrl(null);
    setLastOperation(null);
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
      setTxHash(null);
      setExplorerUrl(null);
      return;
    }

    if (!isTestnet) {
      setStatus("error");
      setMessage("Switch Freighter to Testnet before sending a payment.");
      return;
    }

    setIsSubmitting(true);
    resetFeedback();

    try {
      setStatus("building");
      setMessage("Preparing transaction...");
      const prepared = await prepareSendPayment(
        address,
        destination.trim(),
        amount.trim(),
      );

      setLastOperation(prepared.operation);
      setMessage(prepared.summary);

      setStatus("signing");
      setMessage(`${prepared.summary} Confirm in Freighter...`);
      const signedXdr = await sign(prepared.xdr);

      setStatus("submitting");
      setMessage("Submitting transaction to testnet...");
      const result = await submitPayment(signedXdr);

      setStatus("success");
      setMessage(getSuccessMessage(prepared.operation));
      setTxHash(result.hash);
      setExplorerUrl(getExplorerTxUrl(result.hash));
      setDestination("");
      setAmount("");
      onSuccess();
    } catch (error) {
      setStatus("error");
      setMessage(getTransactionErrorMessage(error));
      setTxHash(null);
      setExplorerUrl(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-[color:var(--color-ink)] sm:text-3xl">
            Send payment
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--color-ink-muted)]">
            Existing accounts receive a payment. New addresses are created
            automatically when you send at least 1 XLM.
          </p>
        </div>
        {lastOperation && status !== "idle" && status !== "error" && (
          <span className="inline-flex w-fit rounded-full bg-[color:var(--color-accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
            {lastOperation === "payment" ? "Payment mode" : "Create account mode"}
          </span>
        )}
      </div>

      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-muted)]">
            Destination
          </span>
          <input
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="GABC...WXYZ"
            disabled={disabled || isSubmitting}
            className="w-full rounded-[1.25rem] border-2 border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] px-4 py-4 font-mono text-sm text-[color:var(--color-ink)] outline-none transition-all duration-200 focus:border-[color:var(--color-accent)] focus:shadow-[0_0_0_4px_rgba(255,92,0,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-muted)]">
            Amount
          </span>
          <div className="flex overflow-hidden rounded-[1.25rem] border-2 border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] transition-all duration-200 focus-within:border-[color:var(--color-accent)] focus-within:shadow-[0_0_0_4px_rgba(255,92,0,0.12)]">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="1"
              disabled={disabled || isSubmitting}
              className="min-w-0 flex-1 bg-transparent px-4 py-4 text-lg font-semibold text-[color:var(--color-ink)] outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="flex items-center border-l border-[color:var(--color-paper-dark)] px-4 text-sm font-semibold text-[color:var(--color-ink-muted)]">
              XLM
            </span>
          </div>
        </label>

        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="w-full rounded-[1.25rem] bg-[color:var(--color-ink)] px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:bg-[#2a241f] hover:shadow-[0_10px_24px_rgba(20,17,15,0.18)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isSubmitting ? "Working on it..." : "Send Payment"}
        </button>
      </form>

      <TransactionFeedback
        status={status}
        message={message}
        txHash={txHash}
        explorerUrl={explorerUrl}
      />
    </div>
  );
}
