interface ConnectWalletProps {
  connected: boolean;
  address: string | null;
  network: string | null;
  isTestnet: boolean;
  isInstalled: boolean;
  isChecking: boolean;
  freighterInstallUrl: string;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  variant?: "sidebar" | "compact";
}

export function ConnectWallet({
  connected,
  address,
  network,
  isTestnet,
  isInstalled,
  isChecking,
  freighterInstallUrl,
  onConnect,
  onDisconnect,
  variant = "sidebar",
}: ConnectWalletProps) {
  const handleConnect = async () => {
    try {
      await onConnect();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to connect wallet.");
    }
  };

  const shellClass =
    variant === "sidebar"
      ? "rounded-[1.75rem] border border-white/10 bg-[color:var(--color-panel-muted)] p-4"
      : "rounded-2xl border-2 border-[color:var(--color-ink)] bg-white p-4 shadow-[4px_4px_0_0_#14110f]";

  if (isChecking) {
    return (
      <div className={shellClass}>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[color:var(--color-accent)] animate-pulse-dot" />
          Checking Freighter...
        </div>
      </div>
    );
  }

  if (!isInstalled) {
    return (
      <div className={shellClass}>
        <p className="text-sm font-semibold text-white">Freighter not found</p>
        <p className="mt-2 text-sm text-white/60">
          Install the browser extension to connect your Stellar wallet.
        </p>
        <a
          href={freighterInstallUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--color-ink)] transition hover:translate-y-[-1px]"
        >
          Get Freighter
        </a>
      </div>
    );
  }

  if (connected && address) {
    return (
      <div className={shellClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                Connected
              </p>
            </div>
            <p className="mt-3 font-mono text-sm text-white sm:text-base">
              {address.slice(0, 6)}...{address.slice(-6)}
            </p>
            <p className="mt-2 text-xs text-white/45">{network ?? "Unknown network"}</p>
          </div>
          <button
            type="button"
            onClick={onDisconnect}
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/35 hover:text-white"
          >
            Leave
          </button>
        </div>

        {!isTestnet && (
          <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs leading-relaxed text-amber-100">
            Switch Freighter to Testnet before sending payments.
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleConnect()}
      className="w-full rounded-[1.75rem] bg-[color:var(--color-accent)] px-5 py-4 text-left transition-all duration-300 hover:translate-y-[-2px] hover:brightness-105 hover:shadow-[0_12px_30px_rgba(255,92,0,0.25)]"
    >
      <span className="font-display text-lg font-bold text-[color:var(--color-ink)]">
        Connect Freighter
      </span>
      <span className="mt-1 block text-sm text-[color:var(--color-ink)]/70">
        Link your testnet wallet to begin
      </span>
    </button>
  );
}
