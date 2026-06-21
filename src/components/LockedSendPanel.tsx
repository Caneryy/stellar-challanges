export function LockedSendPanel() {
  return (
    <div className="rounded-[1.5rem] border-2 border-dashed border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] px-5 py-8 text-center">
      <p className="font-display text-2xl font-extrabold text-[color:var(--color-ink)]">
        Send unlocks after funding
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[color:var(--color-ink-muted)]">
        Complete the Fund Account step first. Friendbot adds the starter XLM you
        need for fees and transfers.
      </p>
    </div>
  );
}
