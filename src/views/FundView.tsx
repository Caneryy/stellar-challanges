import { FundTabPanel } from "../components/FundTabPanel";

interface FundViewProps {
  connected: boolean;
  needsFunding: boolean;
  isBalanceLoading: boolean;
  isFunding: boolean;
  message: string | null;
  onConnect: () => void;
  onFund: () => void;
  onGoToSend: () => void;
}

export function FundView({
  connected,
  needsFunding,
  isBalanceLoading,
  isFunding,
  message,
  onConnect,
  onFund,
  onGoToSend,
}: FundViewProps) {
  return (
    <div className="p-5">
      <h2 className="font-display text-lg font-extrabold text-[color:var(--color-ink)]">
        Fund wallet
      </h2>
      <p className="mt-1 text-sm text-[color:var(--color-ink-muted)]">
        Get starter testnet XLM from Friendbot.
      </p>

      {connected && isBalanceLoading ? (
        <div className="mt-4 h-20 rounded-xl animate-shimmer" />
      ) : !connected || needsFunding ? (
        <div className="mt-4">
          <FundTabPanel
            connected={connected}
            disabled={!needsFunding}
            isFunding={isFunding}
            onConnect={onConnect}
            onFund={onFund}
            message={message}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-4 rounded-xl border-2 border-[color:var(--color-success)]/30 bg-[color:var(--color-success-soft)] p-4">
          <p className="text-sm font-semibold text-[color:var(--color-success)]">
            Wallet already funded
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--color-ink-muted)]">
            Friendbot only adds XLM to empty testnet accounts. Your wallet already
            has a balance, so funding is not needed right now.
          </p>
          <button
            type="button"
            onClick={onGoToSend}
            className="rounded-xl bg-[color:var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Go to Send
          </button>
        </div>
      )}
    </div>
  );
}
