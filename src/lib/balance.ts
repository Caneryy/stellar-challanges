import { horizon } from "./stellar";

export async function getXlmBalance(address: string): Promise<string> {
  try {
    const account = await horizon.loadAccount(address);
    const nativeBalance = account.balances.find(
      (balance) => balance.asset_type === "native",
    );

    return nativeBalance?.balance ?? "0";
  } catch (error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status === 404) {
      return "0";
    }

    throw error;
  }
}
