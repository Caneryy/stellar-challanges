interface FundAccountButtonProps {
  disabled: boolean;
  isFunding: boolean;
  onFund: () => void;
}

export function FundAccountButton({
  disabled,
  isFunding,
  onFund,
}: FundAccountButtonProps) {
  return (
    <button
      type="button"
      onClick={onFund}
      disabled={disabled || isFunding}
      className="w-full rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isFunding ? "Funding with Friendbot..." : "Fund with Friendbot"}
    </button>
  );
}
