import { Skeleton } from "../../../components/ui/skeleton";

/**
 * Skeleton placeholder for AgencyCard, matching structure and spacing.
 */
export default function AgencyCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-gray-200 bg-white">
      {/* Main Content Row */}
      <div className="flex items-center justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        {/* Right side: Stats + Actions */}
        <div className="flex items-center gap-4">
          {/* Circular Stats */}
          <div className="flex items-center gap-6">
            {[...Array(4)].map((_, statIndex) => (
              <div key={statIndex} className="flex flex-col items-center">
                {/* Circular progress skeleton */}
                <div className="relative w-14 h-14">
                  <div className="w-14 h-14 rounded-full border-4 border-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="h-3 w-6" />
                  </div>
                </div>
                {/* Label skeleton */}
                <Skeleton className="h-3 w-12 mt-1" />
              </div>
            ))}
          </div>

          {/* Expand/Collapse Button */}
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
