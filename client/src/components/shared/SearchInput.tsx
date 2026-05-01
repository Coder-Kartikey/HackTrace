export default function SearchInput({
  name,
  defaultValue,
  placeholder
}: {
  name: string;
  defaultValue?: string;
  placeholder: string;
}) {
  return (
    <input
      type="search"
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-text-muted)]"
    />
  );
}
