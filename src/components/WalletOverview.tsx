import { useState } from "react";
import { splitXlmBalance, truncateMiddle } from "../lib/format";
import { needsFriendbotFunding } from "../lib/walletFlow";

interface WalletOverviewProps {
  address: string;
  balance: string;
  isLoading: boolean;
  error: string | null;
  network: string | null;
  isTestnet: boolean;
}

export function WalletOverview({
  address,
  balance,
  isLoading,
  error,
  network,
  isTestnet,
}: WalletOverviewProps) {
  const { integerPart, decimalPart } = splitXlmBalance(balance);
  const unfunded = needsFriendbotFunding(balance);
  const [copied, setCopied] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert("Could not copy address.");
    }
  };

  const statusLabel = unfunded ? "Fund required" : "Ready to send";
  const displayAddress = showFullAddress ? address : truncateMiddle(address);

  return (
    <section className="animate-fade-up overflow-hidden rounded-[2rem] border-2 border-[color:var(--color-ink)] bg-[#171411] text-white shadow-[8px_8px_0_0_#14110f]">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8">
        <p className="text-sm font-semibold text-white/70">Your wallet</p>
        <p className="text-xs font-medium text-white/45">
          {network ?? "Unknown"} · {isTestnet ? "Testnet" : "Mainnet"}
        </p>
      </div>

      <div className="px-6 py-8 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Balance
            </p>

            {isLoading ? (
              <div className="mt-4 h-14 w-56 max-w-full rounded-2xl animate-shimmer" />
            ) : error ? (
              <p className="mt-4 text-sm text-red-200">{error}</p>
            ) : (
              <div
                key={balance}
                className="animate-balance-pop mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1"
              >
                <span className="font-display text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">
                  {integerPart}
                </span>
                {decimalPart && (
                  <span className="font-display text-3xl font-bold text-white/70 sm:text-4xl">
                    .{decimalPart}
                  </span>
                )}
                <span className="text-base font-semibold text-[color:var(--color-accent)] sm:text-lg">
                  XLM
                </span>
              </div>
            )}
          </div>

          {!isLoading && !error && (
            <span
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                unfunded
                  ? "bg-amber-400/15 text-amber-200"
                  : "bg-emerald-400/15 text-emerald-200"
              }`}
            >
              {statusLabel}
            </span>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Public key
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFullAddress((current) => !current)}
                className="text-xs font-medium text-white/45 transition hover:text-white"
              >
                {showFullAddress ? "Short view" : "Full view"}
              </button>
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-[1rem] border border-white/10 bg-black/30 px-4 py-3">
            <p
              className={`font-mono text-sm leading-6 text-white/90 ${
                showFullAddress ? "break-all" : "truncate"
              }`}
              title={address}
            >
              {displayAddress}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
