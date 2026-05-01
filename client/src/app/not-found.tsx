import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="We couldn't find that page"
      description="The resource you asked for does not exist or has not been ingested yet."
      action={
        <Link
          href="/errors"
          className="inline-flex rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-foreground)]"
        >
          Browse errors
        </Link>
      }
    />
  );
}
