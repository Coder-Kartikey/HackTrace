"use client";

import ErrorState from "@/components/shared/ErrorState";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[var(--color-background)] p-6 text-[var(--color-foreground)]">
          <div className="mx-auto max-w-3xl">
            <ErrorState
              title="The dashboard hit a problem"
              message={error.message}
              actionLabel="Try again"
              onAction={reset}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
