import Card from "@/components/shared/Card";
import CodeBlock from "@/components/shared/CodeBlock";

export default function TestEventSnippet() {
  const snippet = `await trace("test-failure", async () => {
  throw new Error("HackTrace setup test");
});`;

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Verify
      </p>
      <h2 className="mt-2 text-xl font-semibold">Send one intentional failure</h2>
      <div className="mt-5">
        <CodeBlock code={snippet} />
      </div>
    </Card>
  );
}
