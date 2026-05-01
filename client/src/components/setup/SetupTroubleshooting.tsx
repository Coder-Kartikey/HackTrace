import Card from "@/components/shared/Card";
import InlineNotice from "@/components/shared/InlineNotice";

export default function SetupTroubleshooting() {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Troubleshooting
      </p>
      <h2 className="mt-2 text-xl font-semibold">If nothing shows up in the dashboard</h2>
      <div className="mt-5 space-y-4">
        <InlineNotice title="Check the endpoint">
          Make sure the SDK is posting to the backend <code>/events</code> route, not just the base URL.
        </InlineNotice>
        <InlineNotice title="Check the API key" tone="warning">
          The dashboard and the SDK must use the same API key or you will be looking at the wrong namespace.
        </InlineNotice>
        <InlineNotice title="Send one intentional failure" tone="success">
          A small test error is the fastest way to confirm the whole ingestion pipeline is working end to end.
        </InlineNotice>
      </div>
    </Card>
  );
}
