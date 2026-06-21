import { useState } from "react";
import { truncateMiddle } from "../lib/format";

interface SendSuccessResultProps {
  message: string;
  amount: string;
  destination: string;
  txHash: string;
  explorerUrl: string;
  onSendAnother: () => void;
}

export function SendSuccessResult({
  message,
  amount,
  destination,
  txHash,
  explorerUrl,
  onSendAnother,
}: SendSuccessResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert("Could not copy transaction hash.");
    }
  };

  return (
    <div className="rounded-xl border-2 border-[color:var(--color-success)] bg-[color:var(--color-success-soft)] p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-success)] text-lg text-white"
          aria-hidden
        >
          ✓
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-extrabold text-[color:var(--color-success)]">
            {message}
          </p>
          <p className="mt-1 text-sm text-[color:var(--color-ink)]">
            Sent{" "}
            <span className="font-semibold">
              {amount} XLM
            </span>{" "}
            to{" "}
            <span className="font-mono text-xs" title={destination}>
              {truncateMiddle(destination, 6, 6)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[color:var(--color-success)]/30 bg-white/70 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:var(--color-ink-muted)]">
          Transaction hash
        </p>
        <div className="mt-1 flex min-w-0 items-center gap-2">
          <p className="min-w-0 flex-1 truncate font-mono text-xs text-[color:var(--color-ink)]" title={txHash}>
            {truncateMiddle(txHash, 12, 12)}
          </p>
          <button
            type="button"
            onClick={() => void handleCopyHash()}
            className="shrink-0 text-[11px] font-semibold text-[color:var(--color-success)] hover:underline"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-[color:var(--color-success)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          View on Stellar Expert
        </a>
        <button
          type="button"
          onClick={onSendAnother}
          className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-[color:var(--color-ink)]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--color-ink)]"
        >
          Send another payment
        </button>
      </div>
    </div>
  );
}
