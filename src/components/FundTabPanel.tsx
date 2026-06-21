interface FundTabPanelProps {
  disabled: boolean;
  isFunding: boolean;
  onFund: () => void;
  message: string | null;
}

export function FundTabPanel({
  disabled,
  isFunding,
  onFund,
  message,
}: FundTabPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-[color:var(--color-ink)] sm:text-3xl">
          Fund your wallet first
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--color-ink-muted)]">
          Your balance is empty. Friendbot can create your testnet account and add
          starter XLM once. After that, sending unlocks automatically.
        </p>
      </div>

      <div className="rounded-[1.5rem] border-2 border-[color:var(--color-accent)]/20 bg-[color:var(--color-accent-soft)] px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-muted)]">
          Why this step exists
        </p>
        <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-ink-muted)]">
          <li>Stellar accounts must exist on the ledger before they can send XLM.</li>
          <li>Friendbot only works for unfunded testnet wallets.</li>
          <li>If you already have a balance, this step is skipped for you.</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onFund}
        disabled={disabled || isFunding}
        className="w-full rounded-[1.25rem] bg-[color:var(--color-accent)] px-4 py-4 text-base font-semibold text-[color:var(--color-ink)] transition-all duration-200 hover:translate-y-[-1px] hover:brightness-105 hover:shadow-[0_10px_24px_rgba(255,92,0,0.22)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {isFunding ? "Requesting testnet XLM..." : "Fund with Friendbot"}
      </button>

      {message && (
        <p className="animate-scale-in rounded-[1.25rem] border-2 border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] px-4 py-3 text-sm leading-relaxed text-[color:var(--color-ink-muted)]">
          {message}
        </p>
      )}
    </div>
  );
}
