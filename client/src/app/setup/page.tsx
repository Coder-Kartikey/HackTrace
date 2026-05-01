import PageHeader from "@/components/layout/PageHeader";
import SetupChecklist from "@/components/setup/SetupChecklist";
import InstallSnippet from "@/components/setup/InstallSnippet";
import InitSnippet from "@/components/setup/InitSnippet";
import TestEventSnippet from "@/components/setup/TestEventSnippet";
import ConnectionStatus from "@/components/setup/ConnectionStatus";
import EnvironmentSnippet from "@/components/setup/EnvironmentSnippet";
import SetupTroubleshooting from "@/components/setup/SetupTroubleshooting";
import Card from "@/components/shared/Card";
import { getApiConfig } from "@/lib/api/config";
import { fetchHealth } from "@/lib/api/overview";

export default async function SetupPage() {
  const config = getApiConfig();
  const health = await fetchHealth().catch(() => null);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title="Get your app sending useful traces quickly."
        description="This page should make the first integration easy: install the SDK, initialize it correctly, wrap real work with traces, and confirm the backend is receiving data."
      />

      <ConnectionStatus health={health} apiUrl={config.apiUrl} />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SetupChecklist />
        <div className="space-y-6">
          <InstallSnippet />
          <EnvironmentSnippet config={config} />
          <InitSnippet config={config} />
          <TestEventSnippet />
        </div>
      </div>

      <Card>
        <h2 className="text-xl font-semibold">Browser note</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
          If you need to resume work after a browser async boundary, capture the continuation
          with <code className="mx-1 rounded bg-[var(--color-surface-soft)] px-1.5 py-0.5">bindContext()</code>
          before leaving the active trace scope. That keeps related spans attached to the right root trace.
        </p>
      </Card>

      <SetupTroubleshooting />
    </div>
  );
}
