import { useState } from "react";
import { BalanceCard } from "./components/BalanceCard";
import { FundAccountButton } from "./components/FundAccountButton";
import { Header } from "./components/Header";
import { SendPaymentForm } from "./components/SendPaymentForm";
import { useBalance } from "./hooks/useBalance";
import { useFreighter } from "./hooks/useFreighter";
import { fundAccount } from "./lib/friendbot";

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
      setFundMessage("Account funded successfully with Friendbot.");
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

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <Header
          connected={connected}
          address={address}
          network={network}
          isTestnet={isTestnet}
          isInstalled={isInstalled}
          isChecking={isChecking}
          freighterInstallUrl={freighterInstallUrl}
          onConnect={connect}
          onDisconnect={disconnect}
        />

        {!walletReady ? (
          <section className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-left text-sm text-slate-300">
            Connect your Freighter wallet on Stellar testnet to view your balance
            and send XLM.
          </section>
        ) : (
          <>
            <BalanceCard
              address={address!}
              balance={balance}
              isLoading={isBalanceLoading}
              error={balanceError}
            />

            <FundAccountButton
              disabled={!walletReady || isBalanceLoading}
              isFunding={isFunding}
              onFund={() => void handleFund()}
            />

            {fundMessage && (
              <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200">
                {fundMessage}
              </p>
            )}

            <SendPaymentForm
              address={address}
              isTestnet={isTestnet}
              disabled={!walletReady}
              onSuccess={() => void refreshBalance()}
              sign={sign}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
