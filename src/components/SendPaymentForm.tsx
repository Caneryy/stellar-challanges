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
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-xl shadow-black/20">
      <h2 className="text-lg font-semibold text-white">Send XLM</h2>
      <p className="mt-1 text-sm text-slate-300">
        Send Payment works for both existing accounts and new addresses. If the
        destination does not exist yet, at least 1 XLM will create and fund it.
      </p>

      <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Destination address</span>
          <input
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="G..."
            disabled={disabled || isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Amount (XLM)</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="1"
            disabled={disabled || isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>

        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Send Payment"}
        </button>
      </form>

      {lastOperation && status !== "idle" && status !== "error" && message && (
        <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
          Operation: {lastOperation === "payment" ? "Payment" : "Create Account"}
        </p>
      )}

      <div className="mt-4">
        <TransactionFeedback
          status={status}
          message={message}
          txHash={txHash}
          explorerUrl={explorerUrl}
        />
      </div>
    </section>
  );
}
