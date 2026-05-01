import { cn } from "@/lib/utils/cn";

export default function InlineNotice({
  tone = "neutral",
  title,
  children
}: {
  tone?: "neutral" | "warning" | "critical" | "success";
  title: string;
  children: React.ReactNode;
}) {
  const tones = {
    neutral: "border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-foreground)]",
    warning: "border-[var(--color-warning)]/35 bg-[var(--color-warning)]/12 text-[var(--color-warning)]",
    critical: "border-[var(--color-critical)]/35 bg-[var(--color-critical)]/12 text-[var(--color-critical)]",
    success: "border-[var(--color-success)]/35 bg-[var(--color-success)]/12 text-[var(--color-success)]"
  };

  return (
    <div className={cn("rounded-2xl border px-4 py-3", tones[tone])}>
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 text-sm leading-6">{children}</div>
    </div>
  );
}
