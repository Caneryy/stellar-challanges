import { ConnectWallet } from "./ConnectWallet";

interface WalletSidebarProps {
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

export function WalletSidebar({
  connected,
  address,
  network,
  isTestnet,
  isInstalled,
  isChecking,
  freighterInstallUrl,
  onConnect,
  onDisconnect,
}: WalletSidebarProps) {
  return (
    <aside className="animate-fade-left relative order-1 overflow-hidden bg-[color:var(--color-panel)] px-5 py-8 text-white sm:px-8 lg:order-2 lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:flex-col lg:justify-between">
      <div className="animate-glow-pulse pointer-events-none absolute -left-16 top-24 h-40 w-40 rounded-full bg-[color:var(--color-accent)]/15 blur-3xl" />

      <div className="relative">
        <div className="animate-scale-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent)] animate-pulse-dot" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
            Stellar Testnet
          </span>
        </div>

        <h1 className="font-display animate-fade-left stagger-1 mt-8 text-4xl font-extrabold leading-[0.95] sm:text-5xl">
          Lumen
          <span className="block text-[color:var(--color-accent)]">Send</span>
        </h1>
        <p className="animate-fade-left stagger-2 mt-4 max-w-sm text-sm leading-relaxed text-white/55">
          Connect here, then fund if your balance is empty. Sending opens only
          after Friendbot gives you starter testnet XLM.
        </p>
      </div>

      <div className="animate-fade-left stagger-3 relative mt-10 space-y-4">
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
          variant="sidebar"
        />

        <div className="hidden rounded-[1.5rem] border border-dashed border-white/10 px-4 py-5 text-sm leading-relaxed text-white/40 lg:block">
          <p className="font-semibold text-white/55">Quick path</p>
          <p className="mt-3">1. Connect here</p>
          <p>2. Fund if balance is 0</p>
          <p>3. Send after funded</p>
        </div>
      </div>
    </aside>
  );
}
