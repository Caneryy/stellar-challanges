import { useEffect, useRef, useState } from "react";
import { getDefaultSection, type AppSection } from "./config/navigation";
import { AppShell } from "./layout/AppShell";
import { FundView } from "./views/FundView";
import { SendView } from "./views/SendView";
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
  const [activeSection, setActiveSection] = useState<AppSection>("fund");
  const wasWalletReady = useRef(false);

  const walletReady = connected && Boolean(address);
  const needsFunding = needsFriendbotFunding(balance);
  const canSend = canSendPayments(balance);
  const sendLocked = needsFunding;

  useEffect(() => {
    if (walletReady && !wasWalletReady.current && !isBalanceLoading) {
      setActiveSection(getDefaultSection(needsFunding));
    }

    wasWalletReady.current = walletReady;
  }, [walletReady, isBalanceLoading, needsFunding]);

  const handleFund = async () => {
    if (!address) {
      return;
    }

    setIsFunding(true);
    setFundMessage(null);

    try {
      await fundAccount(address);
      setFundMessage("Wallet funded successfully.");
      await refreshBalance();
      setActiveSection("send");
    } catch (error) {
      setFundMessage(
        error instanceof Error ? error.message : "Friendbot funding failed.",
      );
    } finally {
      setIsFunding(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setFundMessage(null);
    setActiveSection("fund");
  };

  const renderSection = () => {
    if (!address) {
      return null;
    }

    if (activeSection === "fund") {
      return (
        <FundView
          needsFunding={needsFunding}
          isBalanceLoading={isBalanceLoading}
          isFunding={isFunding}
          message={fundMessage}
          onFund={() => void handleFund()}
          onGoToSend={() => setActiveSection("send")}
        />
      );
    }

    return (
      <SendView
        address={address}
        isTestnet={isTestnet}
        canSend={canSend}
        onSuccess={() => void refreshBalance({ silent: true })}
        onGoToFund={() => setActiveSection("fund")}
        sign={sign}
      />
    );
  };

  return (
    <AppShell
      connected={walletReady}
      address={address}
      balance={balance}
      balanceLoading={isBalanceLoading}
      balanceError={balanceError}
      network={network}
      isTestnet={isTestnet}
      isInstalled={isInstalled}
      isChecking={isChecking}
      freighterInstallUrl={freighterInstallUrl}
      onConnect={connect}
      onDisconnect={handleDisconnect}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      sendLocked={sendLocked}
    >
      {renderSection()}
    </AppShell>
  );
}

export default App;
