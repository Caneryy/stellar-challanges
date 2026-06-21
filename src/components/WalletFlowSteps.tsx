interface WalletFlowStepsProps {
  connected: boolean;
  needsFunding: boolean;
  isBalanceLoading: boolean;
}

export function WalletFlowSteps({
  connected,
  needsFunding,
  isBalanceLoading,
}: WalletFlowStepsProps) {
  const fundComplete = connected && !isBalanceLoading && !needsFunding;

  const steps = [
    { label: "Connect", state: connected ? "done" : "active" },
    {
      label: "Fund",
      state: fundComplete ? "done" : connected && !isBalanceLoading ? "active" : "idle",
    },
    { label: "Send", state: fundComplete ? "active" : "idle" },
  ] as const;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {steps.map((step, index) => (
        <div key={step.label} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              step.state === "done"
                ? "bg-[color:var(--color-success)] text-white"
                : step.state === "active"
                  ? "bg-[color:var(--color-accent)] text-[color:var(--color-ink)]"
                  : "border-2 border-[color:var(--color-paper-dark)] bg-white text-[color:var(--color-ink-muted)]"
            }`}
          >
            {step.state === "done" ? "✓" : index + 1}
          </div>
          <p
            className={`truncate text-sm font-semibold ${
              step.state === "idle"
                ? "text-[color:var(--color-ink-muted)]"
                : "text-[color:var(--color-ink)]"
            }`}
          >
            {step.label}
          </p>
          {index < steps.length - 1 && (
            <div className="hidden h-px flex-1 bg-[color:var(--color-paper-dark)] sm:block" />
          )}
        </div>
      ))}
    </div>
  );
}
