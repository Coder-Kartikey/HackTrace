import Card from "@/components/shared/Card";
import CodeBlock from "@/components/shared/CodeBlock";

export default function InstallSnippet() {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Install
      </p>
      <h2 className="mt-2 text-xl font-semibold">Add the SDK</h2>
      <div className="mt-5">
        <CodeBlock code="npm install hacktrace" />
      </div>
    </Card>
  );
}
