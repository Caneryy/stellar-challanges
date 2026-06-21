import { config } from "./stellar";

function getFriendbotErrorMessage(status: number, body: string): string {
  const normalized = body.toLowerCase();

  if (
    status === 400 &&
    (normalized.includes("already funded") || normalized.includes("createaccount"))
  ) {
    return "This wallet already has testnet XLM. Friendbot only funds empty accounts, so you can continue with Send.";
  }

  return body || "Friendbot funding failed.";
}

export async function fundAccount(address: string): Promise<void> {
  const url = `${config.friendbotUrl}?addr=${encodeURIComponent(address)}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(getFriendbotErrorMessage(response.status, message));
  }
}
