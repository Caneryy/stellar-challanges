import type { ReactNode } from "react";
import { AppHeader } from "../components/AppHeader";
import { WalletBar } from "../components/WalletBar";
import type { AppSection } from "../config/navigation";
import { AppNav } from "./AppNav";

interface AppShellProps {
  connected: boolean;
  address: string | null;
  balance: string;
  balanceLoading: boolean;
  balanceError: string | null;
  network: string | null;
  isTestnet: boolean;
  isInstalled: boolean;
  isChecking: boolean;
  freighterInstallUrl: string;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
  sendLocked: boolean;
  children: ReactNode;
}

export function AppShell({
  connected,
  address,
  balance,
  balanceLoading,
  balanceError,
  network,
  isTestnet,
  isInstalled,
  isChecking,
  freighterInstallUrl,
  onConnect,
  onDisconnect,
  activeSection,
  onSectionChange,
  sendLocked,
  children,
}: AppShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-4 sm:px-6 sm:py-5">
      <AppHeader
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

      {!connected || !address ? (
        <section className="mt-4 rounded-2xl border-2 border-dashed border-[color:var(--color-ink)]/20 bg-white p-6 text-center">
          <p className="font-display text-xl font-extrabold text-[color:var(--color-ink)]">
            Connect Freighter to start
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-ink-muted)]">
            Your address and balance will stay visible here. Use Fund and Send below.
          </p>
        </section>
      ) : (
        <div className="mt-4 space-y-4">
          <WalletBar
            address={address}
            balance={balance}
            isLoading={balanceLoading}
            error={balanceError}
          />

          <div className="grid gap-4 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-5">
            <AppNav
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              sendLocked={sendLocked}
            />

            <main className="min-w-0 rounded-2xl border-2 border-[color:var(--color-ink)] bg-white shadow-[6px_6px_0_0_#14110f]">
              {children}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
