import { config } from "./stellar";

export async function fundAccount(address: string): Promise<void> {
  const url = `${config.friendbotUrl}?addr=${encodeURIComponent(address)}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Friendbot funding failed");
  }
}
