import { cn } from "@/lib/utils/cn";

export default function LoadingSkeleton({
  className
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[24px] bg-[var(--color-surface-soft)]/80",
        className
      )}
    />
  );
}
