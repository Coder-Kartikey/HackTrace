import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-14 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <LoadingSkeleton className="h-32 w-full" />
        <LoadingSkeleton className="h-32 w-full" />
        <LoadingSkeleton className="h-32 w-full" />
      </div>
      <LoadingSkeleton className="h-80 w-full" />
    </div>
  );
}
