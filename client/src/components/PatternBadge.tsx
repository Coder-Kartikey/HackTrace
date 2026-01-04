type Pattern = {
  type: string;
  errorFn?: string;
  failurePath?: string;
};

export default function PatternBadge({
  pattern
}: {
  pattern: Pattern;
}) {
  if (!pattern) return null;

  let color = "";
  let title = "";
  let description = "";

  switch (pattern.type) {
    case "KNOWN_PATH_FAILURE":
      color = "bg-red-100 border-red-300 text-red-800";
      title = "Known Failure Path";
      description = `This exact execution path has previously resulted in failure.`;
      break;

    case "KNOWN_FUNCTION_FAILURE":
      color = "bg-orange-100 border-orange-300 text-orange-800";
      title = "Repeated Function Failure";
      description = `The function "${pattern.errorFn}" has failed in multiple executions.`;
      break;

    case "NEW_ANOMALY":
      color = "bg-green-100 border-green-300 text-green-800";
      title = "New Anomaly";
      description = `This failure pattern has not been seen before.`;
      break;

    default:
      return null;
  }

  return (
    <div className={`border rounded p-4 ${color}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm mt-1">{description}</p>

      {pattern.failurePath && (
        <div className="mt-2 text-xs font-mono break-all">
          Path: {pattern.failurePath}
        </div>
      )}
    </div>
  );
}
