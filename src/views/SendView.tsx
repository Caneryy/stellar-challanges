import { SendPaymentForm } from "../components/SendPaymentForm";

interface SendViewProps {
  address: string;
  isTestnet: boolean;
  canSend: boolean;
  onSuccess: () => void;
  onGoToFund: () => void;
  sign: (xdr: string) => Promise<string>;
}

export function SendView({
  address,
  isTestnet,
  canSend,
  onSuccess,
  onGoToFund,
  sign,
}: SendViewProps) {
  return (
    <div className="p-5">
      <h2 className="font-display text-lg font-extrabold text-[color:var(--color-ink)]">
        Send XLM
      </h2>
      <p className="mt-1 text-sm text-[color:var(--color-ink-muted)]">
        Transfer native XLM on Stellar testnet.
      </p>

      {!canSend ? (
        <div className="mt-4 space-y-4 rounded-xl border-2 border-dashed border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] p-4">
          <p className="text-sm font-semibold text-[color:var(--color-ink)]">
            Fund your wallet first
          </p>
          <p className="text-sm text-[color:var(--color-ink-muted)]">
            You need testnet XLM before sending. Use Friendbot on the Fund page.
          </p>
          <button
            type="button"
            onClick={onGoToFund}
            className="rounded-xl bg-[color:var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-ink)]"
          >
            Go to Fund
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <SendPaymentForm
            address={address}
            isTestnet={isTestnet}
            disabled={false}
            onSuccess={onSuccess}
            sign={sign}
          />
        </div>
      )}
    </div>
  );
}
