import Card from "@/components/shared/Card";
import CodeBlock from "@/components/shared/CodeBlock";
import type { SetupSnippetConfig } from "@/types/setup";

export default function EnvironmentSnippet({
  config
}: {
  config: SetupSnippetConfig;
}) {
  const code = `NEXT_PUBLIC_API_URL=${config.apiUrl}
HACKTRACE_API_KEY=${config.apiKey}`;

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Environment
      </p>
      <h2 className="mt-2 text-xl font-semibold">Recommended dashboard variables</h2>
      <div className="mt-5">
        <CodeBlock code={code} />
      </div>
    </Card>
  );
}
