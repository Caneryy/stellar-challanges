export type AppSection = "fund" | "send";

export interface NavItem {
  id: AppSection;
  label: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "fund",
    label: "Fund",
    description: "Friendbot testnet XLM",
  },
  {
    id: "send",
    label: "Send",
    description: "Transfer XLM",
  },
];

export function getDefaultSection(needsFunding: boolean): AppSection {
  return needsFunding ? "fund" : "send";
}
