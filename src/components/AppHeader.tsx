import { ConnectWallet } from "./ConnectWallet";

interface AppHeaderProps {
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

export function AppHeader({
  connected,
  address,
  network,
  isTestnet,
  isInstalled,
  isChecking,
  freighterInstallUrl,
  onConnect,
  onDisconnect,
}: AppHeaderProps) {
  return (
    <header className="mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-muted)]">
          Stellar Testnet
        </p>
        <h1 className="font-display text-2xl font-extrabold leading-none text-[color:var(--color-ink)]">
          Lumen<span className="text-[color:var(--color-accent)]">Send</span>
        </h1>
      </div>

      <ConnectWallet
        connected={connected}
        address={address}
        network={network}
        isTestnet={isTestnet}
        isInstalled={isInstalled}
        isChecking={isChecking}
        freighterInstallUrl={freighterInstallUrl}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />
    </header>
  );
}
