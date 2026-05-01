import SearchInput from "@/components/shared/SearchInput";
import Select from "@/components/shared/Select";
import DateRangePicker from "@/components/shared/DateRangePicker";
import Card from "@/components/shared/Card";
import type { ErrorFiltersState } from "@/lib/api/errors";

export default function ErrorFilters({
  filters
}: {
  filters: ErrorFiltersState;
}) {
  return (
    <Card>
      <form className="grid gap-4 lg:grid-cols-[2fr_repeat(4,minmax(0,1fr))]">
        <input type="hidden" name="page" value="1" />
        <SearchInput
          name="q"
          defaultValue={filters.q}
          placeholder="Search by error name, message, or fingerprint"
        />
        <Select
          name="severity"
          defaultValue={filters.severity}
          options={[
            { value: "all", label: "All severities" },
            { value: "critical", label: "Critical" },
            { value: "warning", label: "Warning" },
            { value: "info", label: "Info" }
          ]}
        />
        <Select
          name="environment"
          defaultValue={filters.environment}
          options={[
            { value: "all", label: "All environments" },
            { value: "production", label: "Production" },
            { value: "development", label: "Development" },
            { value: "staging", label: "Staging" }
          ]}
        />
        <Select
          name="sort"
          defaultValue={filters.sort}
          options={[
            { value: "lastSeen", label: "Sort: last seen" },
            { value: "occurrences", label: "Sort: occurrences" },
            { value: "severity", label: "Sort: severity" }
          ]}
        />
        <DateRangePicker defaultValue={filters.range} />
        <button
          type="submit"
          className="rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-[var(--color-accent-foreground)]"
        >
          Apply
        </button>
      </form>
    </Card>
  );
}
