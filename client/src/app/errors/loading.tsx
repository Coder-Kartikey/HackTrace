import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

export default function ErrorsLoading() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-32 w-full" />
      <LoadingSkeleton className="h-96 w-full" />
    </div>
  );
}
