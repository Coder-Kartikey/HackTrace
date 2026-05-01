import Link from "next/link";
import NavLinks from "@/components/layout/NavLinks";
import { getApiConfig } from "@/lib/api/config";
import { fetchHealth } from "@/lib/api/overview";

export default async function Topbar() {
  const { apiUrl } = getApiConfig();
  const health = await fetchHealth().catch(() => null);

  return (
    <header className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]/85 px-5 py-4 backdrop-blur">
      <div className="flex flex-col gap-4">
        <div className="lg:hidden">
          <NavLinks orientation="horizontal" />
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Monitoring workspace
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Backend target: <span className="text-[var(--color-foreground)]">{apiUrl}</span>
          </p>
          <p className="mt-2 inline-flex rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)]">
            Status: <span className="ml-1 text-[var(--color-foreground)]">{health?.status === "ok" ? "Connected" : "Check backend"}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/settings"
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-foreground)] transition hover:bg-[var(--color-surface-soft)]"
          >
            Settings
          </Link>
          <Link
            href="/setup"
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-foreground)] transition hover:bg-[var(--color-surface-soft)]"
          >
            SDK setup
          </Link>
          <Link
            href="/errors"
            className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
          >
            Investigate errors
          </Link>
        </div>
      </div>
      </div>
    </header>
  );
}
