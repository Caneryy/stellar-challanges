import { type ReactNode } from "react";

interface ActionTabsProps {
  needsFunding: boolean;
  isBalanceLoading: boolean;
  sendPanel: ReactNode;
  fundPanel: ReactNode;
  lockedSendPanel: ReactNode;
}

const fundTab = {
  id: "fund" as const,
  label: "Fund Account",
  description: "Get starter testnet XLM from Friendbot",
};

const sendTab = {
  id: "send" as const,
  label: "Send XLM",
  description: "Transfer to another testnet address",
};

export function ActionTabs({
  needsFunding,
  isBalanceLoading,
  sendPanel,
  fundPanel,
  lockedSendPanel,
}: ActionTabsProps) {
  if (isBalanceLoading) {
    return (
      <section className="animate-fade-up stagger-2 overflow-hidden rounded-[2rem] border-2 border-[color:var(--color-ink)] bg-white p-8 shadow-[8px_8px_0_0_#14110f]">
        <div className="space-y-3">
          <div className="h-10 w-40 rounded-2xl animate-shimmer" />
          <div className="h-28 rounded-[1.5rem] animate-shimmer opacity-70" />
        </div>
      </section>
    );
  }

  if (!needsFunding) {
    return (
      <section className="animate-fade-up stagger-2 overflow-hidden rounded-[2rem] border-2 border-[color:var(--color-ink)] bg-white shadow-[8px_8px_0_0_#14110f]">
        <div className="border-b-2 border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] px-6 py-4 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-ink-muted)]">
            Next step
          </p>
          <h2 className="font-display mt-1 text-2xl font-extrabold text-[color:var(--color-ink)]">
            Send XLM
          </h2>
        </div>
        <div className="p-6 sm:p-8">{sendPanel}</div>
      </section>
    );
  }

  return (
    <section className="animate-fade-up stagger-2 overflow-hidden rounded-[2rem] border-2 border-[color:var(--color-ink)] bg-white shadow-[8px_8px_0_0_#14110f]">
      <div
        role="tablist"
        aria-label="Wallet actions"
        className="grid grid-cols-2 border-b-2 border-[color:var(--color-paper-dark)]"
      >
        <button
          type="button"
          role="tab"
          aria-selected
          aria-controls="panel-fund"
          id="tab-fund"
          className="bg-[color:var(--color-paper)] px-4 py-4 text-left text-[color:var(--color-ink)] sm:px-6 sm:py-5"
        >
          <span className="block text-sm font-semibold sm:text-base">{fundTab.label}</span>
          <span className="mt-1 hidden text-xs leading-relaxed sm:block">
            {fundTab.description}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={false}
          aria-controls="panel-send"
          id="tab-send"
          disabled
          className="cursor-not-allowed bg-white px-4 py-4 text-left text-[color:var(--color-ink-muted)]/45 sm:px-6 sm:py-5"
        >
          <span className="block text-sm font-semibold sm:text-base">{sendTab.label}</span>
          <span className="mt-1 hidden text-xs leading-relaxed sm:block">
            Available after funding
          </span>
        </button>
      </div>

      <div
        role="tabpanel"
        id="panel-fund"
        aria-labelledby="tab-fund"
        className="border-b-2 border-[color:var(--color-paper-dark)] p-6 sm:p-8"
      >
        {fundPanel}
      </div>

      <div className="p-6 sm:p-8">{lockedSendPanel}</div>
    </section>
  );
}
