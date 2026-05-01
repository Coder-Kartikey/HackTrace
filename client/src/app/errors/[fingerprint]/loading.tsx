import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

export default function ErrorDetailLoading() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-28 w-full" />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <LoadingSkeleton className="h-80 w-full" />
        <LoadingSkeleton className="h-80 w-full" />
      </div>
      <LoadingSkeleton className="h-96 w-full" />
    </div>
  );
}
