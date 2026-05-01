export function formatCount(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return "0";
  }

  return new Intl.NumberFormat().format(value);
}
