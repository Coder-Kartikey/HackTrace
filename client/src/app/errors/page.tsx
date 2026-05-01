import PageHeader from "@/components/layout/PageHeader";
import ErrorFilters from "@/components/errors/ErrorFilters";
import ErrorsTable from "@/components/errors/ErrorsTable";
import EmptyState from "@/components/shared/EmptyState";
import InlineNotice from "@/components/shared/InlineNotice";
import { fetchErrors, type ErrorFiltersState } from "@/lib/api/errors";
import { getNumberSearchParam, getSearchParam } from "@/lib/utils/queryParams";

function normalizeFilters(searchParams?: Record<string, string | string[] | undefined>): ErrorFiltersState {
  return {
    q: getSearchParam(searchParams?.q),
    severity: getSearchParam(searchParams?.severity, "all"),
    environment: getSearchParam(searchParams?.environment, "all"),
    sort: getSearchParam(searchParams?.sort, "lastSeen") as ErrorFiltersState["sort"],
    page: getNumberSearchParam(searchParams?.page, 1),
    range: getSearchParam(searchParams?.range, "30d")
  };
}

export default async function ErrorsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const filters = normalizeFilters(resolvedSearchParams);
  const errorsResult = await fetchErrors(filters.page)
    .then((value) => ({ ok: true as const, value }))
    .catch((error) => ({ ok: false as const, error }));
  const errors = errorsResult.ok ? errorsResult.value : [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Explorer"
        title="Triage grouped failures without losing the shape of the problem."
        description="Search by error text, narrow by environment or severity, and jump directly into the trace behind a failing flow."
      />

      <ErrorFilters filters={filters} />

      {!errorsResult.ok ? (
        <InlineNotice title="The errors explorer could not load fresh data" tone="warning">
          Check the backend connection or API key configuration, then refresh the page.
        </InlineNotice>
      ) : null}

      {errors.length > 0 ? (
        <ErrorsTable errors={errors} filters={filters} />
      ) : (
        <EmptyState
          title="No error groups found"
          description="Either no events have been ingested yet or the selected filters do not match anything."
        />
      )}
    </div>
  );
}
