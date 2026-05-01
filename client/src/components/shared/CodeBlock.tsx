"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export default function CodeBlock({
  code,
  className
}: {
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-4 py-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Snippet
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-surface)]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-[var(--color-foreground)]">
        {code}
      </pre>
    </div>
  );
}
