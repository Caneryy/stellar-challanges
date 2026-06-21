import { ConnectWallet } from "./ConnectWallet";

interface HeaderProps {
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

export function Header({
  connected,
  address,
  network,
  isTestnet,
  isInstalled,
  isChecking,
  freighterInstallUrl,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-left">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
          Stellar Testnet
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
          Simple Payment dApp
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
          Connect Freighter, fund your wallet, and send XLM on testnet.
        </p>
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
