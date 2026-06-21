import * as StellarSdk from "@stellar/stellar-sdk";

export const config = {
  horizonUrl: "https://horizon-testnet.stellar.org",
  networkPassphrase: StellarSdk.Networks.TESTNET,
  friendbotUrl: "https://friendbot.stellar.org",
  networkName: "TESTNET",
};

export const horizon = new StellarSdk.Horizon.Server(config.horizonUrl);

export function getExplorerTxUrl(hash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
