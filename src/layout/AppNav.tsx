import type { AppSection } from "../config/navigation";
import { NAV_ITEMS } from "../config/navigation";

interface AppNavProps {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
  sendLocked: boolean;
}

export function AppNav({ activeSection, onSectionChange, sendLocked }: AppNavProps) {
  return (
    <nav
      aria-label="App sections"
      className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        const isLocked = item.id === "send" && sendLocked;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            className={`min-w-[7.5rem] shrink-0 rounded-xl border-2 px-3 py-2.5 text-left transition lg:min-w-0 lg:w-full ${
              isActive
                ? "border-[color:var(--color-ink)] bg-[color:var(--color-ink)] text-white shadow-[3px_3px_0_0_#ff5c00]"
                : "border-[color:var(--color-paper-dark)] bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]/30"
            }`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">{item.label}</span>
              {isLocked && !isActive && (
                <span className="rounded-full bg-[color:var(--color-paper)] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[color:var(--color-ink-muted)]">
                  Lock
                </span>
              )}
            </span>
            <span
              className={`mt-0.5 block text-[11px] leading-snug ${
                isActive ? "text-white/70" : "text-[color:var(--color-ink-muted)]"
              }`}
            >
              {item.description}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
