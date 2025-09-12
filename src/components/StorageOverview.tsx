import { Package } from "lucide-react";
import { StatCircle } from "./StatCircle";

type StorageOverviewProps = {
  workerNodeStorageGB: number;
  agencyAllottedGB: number;
  agencyAllottedPercent: number; // 0-100
  actualUsedGB: number;
  actualUsedPercent: number; // 0-100
};

/**
 * StorageOverview
 * Compact, responsive summary panel matching the provided design.
 * Uses StatCircle for the two percentage-based stats.
 */
export function StorageOverview({
  workerNodeStorageGB,
  agencyAllottedGB,
  agencyAllottedPercent,
  actualUsedGB,
  actualUsedPercent,
}: StorageOverviewProps) {
  const circleColor = "#FF8A00";

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4 shadow-sm">
      <div className="flex items-center gap-5 sm:gap-8">
        {/* Left: Worker Node Storage */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-[180px]">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-400 flex items-center justify-center shadow-sm">
            <Package className="text-white" size={22} />
          </div>
          <div>
            <div className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              {workerNodeStorageGB.toString().padStart(2, "0")} GB
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Worker Node Storage</div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-10 w-px bg-gray-200" />

        {/* Middle: Agency Allotted Storage */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-[210px]">
          <StatCircle
            value={agencyAllottedPercent}
            label=""
            color={circleColor}
            tooltipText={`${agencyAllottedPercent}% of allotted storage`}
            showPercentage
          />
          <div className="leading-tight">
            <div className="text-base sm:text-lg font-semibold text-gray-900">
              {agencyAllottedGB.toString().padStart(2, "0")} GB
              <span className="ml-2 text-xs sm:text-sm text-gray-400">/{agencyAllottedPercent}%</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Agency Allotted Storage</div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-10 w-px bg-gray-200" />

        {/* Right: Actual Used Storage */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-[210px]">
          <StatCircle
            value={actualUsedPercent}
            label=""
            color={circleColor}
            tooltipText={`${actualUsedPercent}% used of total`}
            showPercentage
          />
          <div className="leading-tight">
            <div className="text-base sm:text-lg font-semibold text-gray-900">
              {actualUsedGB.toString().padStart(2, "0")} GB
              <span className="ml-2 text-xs sm:text-sm text-gray-400">/{actualUsedPercent}%</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Actual Used Storage</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StorageOverview;
