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
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-[color:var(--color-ink-muted)]">
        Friendbot creates your testnet account and adds starter XLM. This step is
        required when your balance is zero.
      </p>

      <button
        type="button"
        onClick={onFund}
        disabled={disabled || isFunding}
        className="w-full rounded-xl bg-[color:var(--color-accent)] py-3 text-sm font-semibold text-[color:var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {isFunding ? "Funding..." : "Fund with Friendbot"}
      </button>

      {message && (
        <p className="rounded-lg bg-[color:var(--color-paper)] px-3 py-2 text-sm text-[color:var(--color-ink-muted)]">
          {message}
        </p>
      )}
    </div>
  );
}
