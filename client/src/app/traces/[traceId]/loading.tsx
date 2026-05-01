import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

export default function TraceLoading() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-28 w-full" />
      <LoadingSkeleton className="h-[620px] w-full" />
    </div>
  );
}
