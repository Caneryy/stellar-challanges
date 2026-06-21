import { useState } from "react";
import { splitXlmBalance, truncateMiddle } from "../lib/format";
import { needsFriendbotFunding } from "../lib/walletFlow";

interface WalletBarProps {
  connected: boolean;
  address: string | null;
  balance: string;
  isLoading: boolean;
  error: string | null;
  onConnect: () => void;
}

export function WalletBar({
  connected,
  address,
  balance,
  isLoading,
  error,
  onConnect,
}: WalletBarProps) {
  const { integerPart, decimalPart } = splitXlmBalance(balance);
  const unfunded = needsFriendbotFunding(balance);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!connected || !address) {
      onConnect();
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert("Could not copy address.");
    }
  };

  return (
    <section className="rounded-2xl border-2 border-[color:var(--color-ink)] bg-[#171411] px-4 py-3 text-white shadow-[4px_4px_0_0_#14110f] sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 sm:max-w-[55%] lg:max-w-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Address
          </p>
          <div className="mt-1 flex min-w-0 items-center gap-2 rounded-lg bg-black/30 px-3 py-2">
            {connected && address ? (
              <p className="min-w-0 flex-1 truncate font-mono text-xs text-white/85" title={address}>
                {truncateMiddle(address, 10, 10)}
              </p>
            ) : (
              <p className="min-w-0 flex-1 font-mono text-xs text-white/40">—</p>
            )}
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="shrink-0 text-[11px] font-semibold text-[color:var(--color-accent)] hover:text-white"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Balance
          </p>
          {!connected ? (
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 sm:justify-end">
              <span className="font-display text-3xl font-extrabold leading-none text-white/40 sm:text-4xl">
                —
              </span>
              <span className="text-sm font-semibold text-white/40">XLM</span>
            </div>
          ) : isLoading ? (
            <div className="mt-1 h-8 w-32 rounded-lg animate-shimmer sm:ml-auto" />
          ) : error ? (
            <p className="mt-1 text-sm text-red-200">{error}</p>
          ) : (
            <div
              key={balance}
              className="mt-0.5 flex flex-wrap items-baseline gap-x-2 sm:justify-end"
            >
              <span className="font-display text-3xl font-extrabold leading-none sm:text-4xl">
                {integerPart}
              </span>
              {decimalPart && (
                <span className="text-lg font-bold text-white/70">.{decimalPart}</span>
              )}
              <span className="text-sm font-semibold text-[color:var(--color-accent)]">
                XLM
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  unfunded ? "bg-amber-400/20 text-amber-100" : "bg-emerald-400/20 text-emerald-100"
                }`}
              >
                {unfunded ? "Needs fund" : "Ready"}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
