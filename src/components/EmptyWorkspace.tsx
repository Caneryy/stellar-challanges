interface EmptyWorkspaceProps {
  onConnect: () => Promise<void>;
  isInstalled: boolean;
  isChecking: boolean;
  freighterInstallUrl: string;
}

export function EmptyWorkspace({
  onConnect,
  isInstalled,
  isChecking,
  freighterInstallUrl,
}: EmptyWorkspaceProps) {
  const handleConnect = async () => {
    try {
      await onConnect();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to connect wallet.");
    }
  };

  return (
    <section className="animate-fade-right flex min-h-[28rem] flex-col justify-between rounded-[2rem] border-2 border-dashed border-[color:var(--color-ink)]/20 bg-white/70 p-8 shadow-[8px_8px_0_0_rgba(20,17,15,0.05)] transition-transform duration-300 hover:translate-y-[-2px] sm:min-h-[34rem] sm:p-10">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-ink-muted)]">
          Workspace
        </p>
        <h2 className="font-display mt-4 text-4xl font-extrabold leading-tight text-[color:var(--color-ink)] sm:text-5xl">
          Connect your wallet to unlock transfers
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[color:var(--color-ink-muted)]">
          Use the panel on the right to link Freighter. Your address and balance
          appear first, then follow Fund before Send.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {["Connect Freighter", "Fund with Friendbot", "Send XLM"].map((step, index) => (
          <div
            key={step}
            className={`animate-fade-up rounded-[1.5rem] border-2 border-[color:var(--color-paper-dark)] bg-[color:var(--color-paper)] p-4 transition-transform duration-300 hover:-translate-y-1`}
            style={{ animationDelay: `${0.08 + index * 0.08}s` }}
          >
            <p className="font-display text-2xl font-bold text-[color:var(--color-accent)]">
              0{index + 1}
            </p>
            <p className="mt-2 text-sm font-semibold text-[color:var(--color-ink)]">{step}</p>
          </div>
        ))}
      </div>

      {!isChecking && !isInstalled && (
        <a
          href={freighterInstallUrl}
          target="_blank"
          rel="noreferrer"
          className="animate-fade-up stagger-4 mt-8 inline-flex w-fit rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:translate-y-[-1px]"
        >
          Install Freighter first
        </a>
      )}

      {!isChecking && isInstalled && (
        <button
          type="button"
          onClick={() => void handleConnect()}
          className="animate-fade-up stagger-4 mt-8 inline-flex w-fit rounded-full bg-[color:var(--color-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
        >
          Connect now
        </button>
      )}
    </section>
  );
}
