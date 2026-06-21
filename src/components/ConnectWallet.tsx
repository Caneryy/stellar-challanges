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
}: ConnectWalletProps) {
  const handleConnect = async () => {
    try {
      await onConnect();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to connect wallet.");
    }
  };

  if (isChecking) {
    return (
      <span className="rounded-full border border-[color:var(--color-paper-dark)] px-3 py-1.5 text-xs text-[color:var(--color-ink-muted)]">
        Checking...
      </span>
    );
  }

  if (!isInstalled) {
    return (
      <a
        href={freighterInstallUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-xs font-semibold text-[color:var(--color-ink)]"
      >
        Install Freighter
      </a>
    );
  }

  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        {!isTestnet && (
          <span className="hidden rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800 sm:inline">
            Wrong network
          </span>
        )}
        <span className="hidden rounded-full bg-[color:var(--color-success-soft)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-success)] sm:inline">
          {network ?? "Connected"}
        </span>
        <button
          type="button"
          onClick={onDisconnect}
          className="rounded-full border-2 border-[color:var(--color-ink)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper)]"
        >
          Leave
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleConnect()}
      className="rounded-full bg-[color:var(--color-ink)] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2a241f]"
    >
      Connect
    </button>
  );
}
