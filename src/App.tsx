import { useState } from "react";
import { ActionTabs } from "./components/ActionTabs";
import { EmptyWorkspace } from "./components/EmptyWorkspace";
import { FundTabPanel } from "./components/FundTabPanel";
import { LockedSendPanel } from "./components/LockedSendPanel";
import { SendPaymentForm } from "./components/SendPaymentForm";
import { WalletFlowSteps } from "./components/WalletFlowSteps";
import { WalletOverview } from "./components/WalletOverview";
import { WalletSidebar } from "./components/WalletSidebar";
import { useBalance } from "./hooks/useBalance";
import { useFreighter } from "./hooks/useFreighter";
import { fundAccount } from "./lib/friendbot";
import { canSendPayments, needsFriendbotFunding } from "./lib/walletFlow";

function App() {
  const {
    connected,
    address,
    network,
    isTestnet,
    isInstalled,
    isChecking,
    connect,
    disconnect,
    sign,
    freighterInstallUrl,
  } = useFreighter();

  const { balance, isLoading: isBalanceLoading, error: balanceError, refreshBalance } =
    useBalance(address);
  const [isFunding, setIsFunding] = useState(false);
  const [fundMessage, setFundMessage] = useState<string | null>(null);

  const handleFund = async () => {
    if (!address) {
      return;
    }

    setIsFunding(true);
    setFundMessage(null);

    try {
      await fundAccount(address);
      setFundMessage("Friendbot added testnet XLM to your wallet. You can send now.");
      await refreshBalance();
    } catch (error) {
      setFundMessage(
        error instanceof Error ? error.message : "Friendbot funding failed.",
      );
    } finally {
      setIsFunding(false);
    }
  };

  const walletReady = connected && Boolean(address);
  const needsFunding = needsFriendbotFunding(balance);
  const canSend = canSendPayments(balance) && !isBalanceLoading;

  return (
    <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[1fr_minmax(320px,420px)]">
      <div className="grid-paper order-2 px-5 py-8 sm:px-8 lg:order-1 lg:px-10 lg:py-10">
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {!walletReady ? (
            <EmptyWorkspace
              onConnect={connect}
              isInstalled={isInstalled}
              isChecking={isChecking}
              freighterInstallUrl={freighterInstallUrl}
            />
          ) : (
            <>
              <WalletOverview
                address={address!}
                balance={balance}
                isLoading={isBalanceLoading}
                error={balanceError}
                network={network}
                isTestnet={isTestnet}
              />

              <WalletFlowSteps
                connected={walletReady}
                needsFunding={needsFunding}
                isBalanceLoading={isBalanceLoading}
              />

              <ActionTabs
                needsFunding={needsFunding}
                isBalanceLoading={isBalanceLoading}
                sendPanel={
                  <SendPaymentForm
                    address={address}
                    isTestnet={isTestnet}
                    disabled={!walletReady || !canSend}
                    onSuccess={() => void refreshBalance()}
                    sign={sign}
                  />
                }
                fundPanel={
                  <FundTabPanel
                    disabled={!walletReady || isBalanceLoading || !needsFunding}
                    isFunding={isFunding}
                    onFund={() => void handleFund()}
                    message={fundMessage}
                  />
                }
                lockedSendPanel={<LockedSendPanel />}
              />
            </>
          )}
        </main>
      </div>

      <WalletSidebar
        connected={connected}
        address={address}
        network={network}
        isTestnet={isTestnet}
        isInstalled={isInstalled}
        isChecking={isChecking}
        freighterInstallUrl={freighterInstallUrl}
        onConnect={connect}
        onDisconnect={() => {
          disconnect();
          setFundMessage(null);
        }}
      />
    </div>
  );
}

export default App;
