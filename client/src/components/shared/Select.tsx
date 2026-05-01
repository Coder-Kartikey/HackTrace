export interface SelectOption {
  value: string;
  label: string;
}

export default function Select({
  name,
  defaultValue,
  options
}: {
  name: string;
  defaultValue?: string;
  options: SelectOption[];
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-foreground)] outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
