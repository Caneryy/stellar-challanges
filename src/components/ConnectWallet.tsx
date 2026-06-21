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
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
        Checking wallet...
      </div>
    );
  }

  if (!isInstalled) {
    return (
      <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-left">
        <p className="text-sm font-medium text-amber-100">Freighter not detected</p>
        <a
          href={freighterInstallUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm text-cyan-300 underline"
        >
          Install Freighter extension
        </a>
      </div>
    );
  }

  if (connected && address) {
    return (
      <div className="flex flex-col items-stretch gap-3 sm:items-end">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left">
          <p className="text-xs uppercase tracking-wide text-slate-400">Connected</p>
          <p className="mt-1 font-mono text-sm text-white">
            {address.slice(0, 4)}...{address.slice(-4)}
          </p>
          <p className="mt-1 text-xs text-slate-400">{network ?? "Unknown network"}</p>
          {!isTestnet && (
            <p className="mt-2 text-xs text-amber-300">
              Switch Freighter to Testnet before sending payments.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onDisconnect}
          className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-100 transition hover:bg-red-500/20"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleConnect()}
      className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
    >
      Connect Wallet
    </button>
  );
}
