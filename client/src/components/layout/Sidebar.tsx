import NavLinks from "@/components/layout/NavLinks";

export default function Sidebar() {
  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-6 shadow-2xl shadow-black/20 lg:block">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
          HackTrace
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Debug the path, not just the crash.
        </h1>
      </div>

      <NavLinks />

      <div className="mt-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
          Focus
        </p>
        <p className="mt-2 text-sm text-[var(--color-foreground)]">
          Find the failing flow, inspect the trace, and shorten the path to a fix.
        </p>
      </div>
    </aside>
  );
}
