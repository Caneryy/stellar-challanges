interface BalanceCardProps {
  address: string;
  balance: string;
  isLoading: boolean;
  error: string | null;
}

export function BalanceCard({
  address,
  balance,
  isLoading,
  error,
}: BalanceCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-xl shadow-black/20">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Wallet Balance</p>
      <p className="mt-2 break-all font-mono text-xs text-slate-300 sm:text-sm">{address}</p>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-slate-300">Loading balance...</p>
        ) : error ? (
          <p className="text-sm text-red-300">{error}</p>
        ) : (
          <>
            <p className="text-3xl font-semibold text-white sm:text-4xl">{balance}</p>
            <p className="mt-1 text-sm text-cyan-300">XLM</p>
          </>
        )}
      </div>
    </section>
  );
}
