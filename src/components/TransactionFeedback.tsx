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
}

export function TransactionFeedback({ status, message }: TransactionFeedbackProps) {
  if (status === "idle" || status === "success" || !message) {
    return null;
  }

  const isError = status === "error";

  return (
    <div
      className={`rounded-xl border px-3 py-2.5 text-sm ${
        isError
          ? "border-[color:var(--color-danger)] bg-[color:var(--color-danger-soft)] text-[color:var(--color-danger)]"
          : "border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] text-[color:var(--color-ink)]"
      }`}
    >
      <p className="font-medium">{message}</p>
    </div>
  );
}
