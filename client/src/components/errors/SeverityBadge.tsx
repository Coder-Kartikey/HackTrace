import Badge from "@/components/shared/Badge";
import type { Severity } from "@/types/api";

const styles: Record<Severity, string> = {
  critical: "border-[var(--color-critical)]/35 bg-[var(--color-critical)]/15 text-[var(--color-critical)]",
  warning: "border-[var(--color-warning)]/35 bg-[var(--color-warning)]/15 text-[var(--color-warning)]",
  info: "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
};

export default function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge className={styles[severity]}>{severity}</Badge>;
}
