import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";
import type { TraceEvent } from "@/types/error";

export default function ErrorEnvironmentPanel({
  events
}: {
  events: TraceEvent[];
}) {
  const runtimes = Array.from(
    new Set(events.map((event) => event.environment?.runtime).filter(Boolean))
  );
  const appEnvironments = Array.from(
    new Set(events.map((event) => event.environment?.appEnvironment).filter(Boolean))
  );
  const sdkVersions = Array.from(
    new Set(events.map((event) => event.environment?.sdkVersion).filter(Boolean))
  );

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        Environment
      </p>
      <h2 className="mt-2 text-xl font-semibold">Where this issue is appearing</h2>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-sm font-semibold">Runtime</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {runtimes.map((runtime) => (
              <Badge key={runtime}>{runtime}</Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">App environment</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {appEnvironments.map((environment) => (
              <Badge key={environment}>{environment}</Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">SDK version</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sdkVersions.map((version) => (
              <Badge key={version}>{version}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
