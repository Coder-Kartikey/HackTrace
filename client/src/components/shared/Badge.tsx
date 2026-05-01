import { cn } from "@/lib/utils/cn";

export default function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs font-medium text-[var(--color-foreground)]",
        className
      )}
    >
      {children}
    </span>
  );
}
