import Card from "@/components/shared/Card";
import CodeBlock from "@/components/shared/CodeBlock";
import type { SetupSnippetConfig } from "@/types/setup";

export default function InitSnippet({ config }: { config: SetupSnippetConfig }) {
  const snippet = `import { init, trace } from "hacktrace-sdk";

init({
  apiKey: "${config.apiKey}",
  endpoint: "${config.apiUrl}/events",
  autoCapture: true
});

await trace("load-dashboard", async () => {
  // your application work
});`;

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Initialize
      </p>
      <h2 className="mt-2 text-xl font-semibold">Point the SDK at your backend</h2>
      <div className="mt-5">
        <CodeBlock code={snippet} />
      </div>
    </Card>
  );
}
