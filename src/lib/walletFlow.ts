/**
 * Returns true when the wallet still needs Friendbot funding.
 * Friendbot only creates or funds accounts that are empty on testnet.
 */
export function needsFriendbotFunding(balance: string): boolean {
  const value = Number(balance);
  return Number.isNaN(value) || value <= 0;
}

export function canSendPayments(balance: string): boolean {
  return !needsFriendbotFunding(balance);
}
