export type TransactionStatus =
  | "idle"
  | "building"
  | "signing"
  | "submitting"
  | "success"
  | "error";

interface TransactionFeedbackProps {
  status: TransactionStatus;
  message: string | null;
  txHash: string | null;
  explorerUrl: string | null;
}

export function TransactionFeedback({
  status,
  message,
  txHash,
  explorerUrl,
}: TransactionFeedbackProps) {
  if (status === "idle" || !message) {
    return null;
  }

  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-left text-sm ${
        isSuccess
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
          : isError
            ? "border-red-400/30 bg-red-400/10 text-red-100"
            : "border-white/10 bg-white/5 text-slate-200"
      }`}
    >
      <p>{message}</p>
      {txHash && (
        <p className="mt-2 break-all font-mono text-xs text-slate-200">
          Hash: {txHash}
        </p>
      )}
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-cyan-300 underline"
        >
          View on Stellar Expert
        </a>
      )}
    </div>
  );
}
