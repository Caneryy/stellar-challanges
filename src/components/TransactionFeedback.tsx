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
      key={`${status}-${message}`}
      className={`rounded-xl border px-3 py-2.5 text-sm ${
        isSuccess
          ? "border-[color:var(--color-success)] bg-[color:var(--color-success-soft)] text-[color:var(--color-success)]"
          : isError
            ? "border-[color:var(--color-danger)] bg-[color:var(--color-danger-soft)] text-[color:var(--color-danger)]"
            : "border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] text-[color:var(--color-ink)]"
      }`}
    >
      <p className="font-medium">{message}</p>
      {txHash && (
        <p className="mt-1 break-all font-mono text-[11px] opacity-80">{txHash}</p>
      )}
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-xs font-semibold underline"
        >
          View on Stellar Expert
        </a>
      )}
    </div>
  );
}
