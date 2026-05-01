import Card from "@/components/shared/Card";

const items = [
  "Install the SDK in the app you want to observe.",
  "Initialize it once with the backend URL and API key.",
  "Wrap meaningful work with trace() so failures preserve flow context.",
  "If needed in browser continuations, use bindContext() before leaving the current async scope.",
  "Trigger one real failing path and confirm it appears in the dashboard."
];

export default function SetupChecklist() {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Checklist
      </p>
      <h2 className="mt-2 text-xl font-semibold">What a successful first setup looks like</h2>
      <ol className="mt-6 space-y-4">
        {items.map((item, index) => (
          <li key={item} className="flex items-start gap-4">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-semibold text-[var(--color-accent-foreground)]">
              {index + 1}
            </span>
            <p className="pt-1 text-sm leading-6 text-[var(--color-foreground)]">{item}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
