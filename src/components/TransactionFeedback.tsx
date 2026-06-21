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
  const isPending = !isSuccess && !isError;

  return (
    <div
      key={`${status}-${message}`}
      className={`animate-scale-in rounded-[1.75rem] border-2 px-5 py-4 shadow-[6px_6px_0_0_rgba(20,17,15,0.08)] ${
        isSuccess
          ? "border-[color:var(--color-success)] bg-[color:var(--color-success-soft)] text-[color:var(--color-success)]"
          : isError
            ? "border-[color:var(--color-danger)] bg-[color:var(--color-danger-soft)] text-[color:var(--color-danger)]"
            : "border-[color:var(--color-ink)] bg-white text-[color:var(--color-ink)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 inline-block h-3 w-3 rounded-full ${
            isSuccess
              ? "bg-[color:var(--color-success)]"
              : isError
                ? "bg-[color:var(--color-danger)]"
                : "bg-[color:var(--color-accent)] animate-pulse-dot"
          }`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-relaxed">{message}</p>

          {txHash && (
            <div className="mt-3 rounded-2xl border border-black/10 bg-white/70 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                Transaction hash
              </p>
              <p className="mt-1 break-all font-mono text-xs text-[color:var(--color-ink)]">
                {txHash}
              </p>
            </div>
          )}

          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline decoration-2 underline-offset-4"
            >
              Open in Stellar Expert
            </a>
          )}

          {isPending && (
            <p className="mt-2 text-xs text-[color:var(--color-ink-muted)]">
              Keep Freighter open until the transaction completes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
