import { cn } from "@/lib/utils/cn";

export default function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
        className
      )}
    >
      {children}
    </section>
  );
}
