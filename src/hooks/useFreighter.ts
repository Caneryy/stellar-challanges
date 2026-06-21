import { useCallback, useEffect, useState } from "react";
import {
  getAddress,
  getNetwork,
  isAllowed,
  isConnected,
  setAllowed,
  signTransaction,
} from "@stellar/freighter-api";
import { config } from "../lib/stellar";

const FREIGHTER_INSTALL_URL = "https://www.freighter.app/";

export function useFreighter() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [isTestnet, setIsTestnet] = useState(true);
  const [isInstalled, setIsInstalled] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  const syncWalletState = useCallback(async () => {
    const connection = await isConnected();
    if (connection.error || !connection.isConnected) {
      setIsInstalled(false);
      setConnected(false);
      setAddress(null);
      setNetwork(null);
      setIsTestnet(false);
      return;
    }

    setIsInstalled(true);

    const allowed = await isAllowed();
    if (allowed.error || !allowed.isAllowed) {
      setConnected(false);
      setAddress(null);
      setNetwork(null);
      setIsTestnet(false);
      return;
    }

    const addressResult = await getAddress();
    if (addressResult.error || !addressResult.address) {
      setConnected(false);
      setAddress(null);
      setNetwork(null);
      setIsTestnet(false);
      return;
    }

    const networkResult = await getNetwork();
    const networkName = networkResult.network ?? null;
    const onTestnet = networkName === config.networkName;

    setConnected(true);
    setAddress(addressResult.address);
    setNetwork(networkName);
    setIsTestnet(onTestnet);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setIsChecking(true);
      await syncWalletState();
      setIsChecking(false);
    };

    void initialize();
  }, [syncWalletState]);

  const connect = useCallback(async () => {
    const connection = await isConnected();
    if (connection.error || !connection.isConnected) {
      throw new Error(
        `Freighter is not installed. Install it from ${FREIGHTER_INSTALL_URL}`,
      );
    }

    const allowed = await setAllowed();
    if (allowed.error || !allowed.isAllowed) {
      throw new Error(allowed.error?.message || "Freighter access was denied.");
    }

    await syncWalletState();
  }, [syncWalletState]);

  const disconnect = useCallback(() => {
    setConnected(false);
    setAddress(null);
    setNetwork(null);
    setIsTestnet(false);
  }, []);

  const sign = useCallback(
    async (xdr: string) => {
      if (!connected) {
        throw new Error("Wallet not connected.");
      }

      const result = await signTransaction(xdr, {
        networkPassphrase: config.networkPassphrase,
        address: address ?? undefined,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to sign transaction.");
      }

      return result.signedTxXdr;
    },
    [address, connected],
  );

  return {
    connected,
    address,
    network,
    isTestnet,
    isInstalled,
    isChecking,
    connect,
    disconnect,
    sign,
    freighterInstallUrl: FREIGHTER_INSTALL_URL,
  };
}
