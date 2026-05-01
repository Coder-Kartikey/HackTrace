import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import CodeBlock from "@/components/shared/CodeBlock";
import { getApiConfig } from "@/lib/api/config";

export default function SettingsPage() {
  const config = getApiConfig();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Know how this dashboard is configured."
        description="This page helps with local setup, environment wiring, and understanding what values the client is using to talk to the backend."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Runtime config
          </p>
          <h2 className="mt-2 text-xl font-semibold">Current frontend target</h2>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold">API URL</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{config.apiUrl}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">API key source</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>HACKTRACE_API_KEY</Badge>
                <Badge>NEXT_PUBLIC_API_KEY</Badge>
                <Badge>fallback: test</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
            Suggested env
          </p>
          <h2 className="mt-2 text-xl font-semibold">Local dashboard variables</h2>
          <div className="mt-5">
            <CodeBlock
              code={`NEXT_PUBLIC_API_URL=${config.apiUrl}
HACKTRACE_API_KEY=${config.apiKey}`}
            />
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
          Notes
        </p>
        <h2 className="mt-2 text-xl font-semibold">What this page is for</h2>
        <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--color-text-muted)]">
          <p>The frontend is intentionally environment-driven now, so local and production dashboards can point at different backends cleanly.</p>
          <p>The dashboard does not manage API keys yet. Right now this page helps developers verify which values the client is using and how to set them.</p>
          <p>Once multi-project auth lands later, this page can grow into a real settings surface instead of a configuration reference.</p>
        </div>
      </Card>
    </div>
  );
}
