import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";

interface AgencyStatsProps {
  stats: {
    websites: {
      used: number;
      total: number;
      percentage: number;
    };
    storage: {
      used: number;
      total: number;
      percentage: number;
      usedDisplay: string;
      totalDisplay: string;
    };
    tokens: {
      used: number;
      total: number;
      percentage: number;
      usedDisplay: string;
      totalDisplay: string;
    };
    images: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}
export default function AgencyStats({ stats }: AgencyStatsProps) {
  const StatCircle = ({ 
    value, 
    label, 
    color,
    tooltipText,
    showPercentage = false
  }: { 
    value: number; 
    label: string; 
    color: string;
    tooltipText: string;
    showPercentage?: boolean;
  }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center cursor-pointer">
              <div className="relative w-14 h-14">
                {/* Background circle */}
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth="5"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke={color}
                    strokeWidth="5"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {showPercentage ? (
                    <span className="text-xs font-semibold">
                      <span style={{ color }}>{value}</span>
                      <span style={{ color }}>%</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold" style={{ color }}>
                      {value}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-1">{label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const getColor = (percentage: number) => {
    if (percentage >= 80) return "#EF4444"; // red
    if (percentage >= 60) return "#F59E0B"; // orange/yellow  
    return "#10B981"; // green
  };

  return (
    <div className="flex items-center gap-6">
      <StatCircle
        value={stats.websites.used}
        label="Website"
        color={getColor(stats.websites.percentage)}
        tooltipText={`${stats.websites.used} / ${stats.websites.total} sites`}
      />
      
      <StatCircle
        value={stats.storage.percentage}
        label="Storage"
        color={getColor(stats.storage.percentage)}
        tooltipText={`${stats.storage.usedDisplay} / ${stats.storage.totalDisplay}`}
        showPercentage
      />
      
      <StatCircle
        value={stats.tokens.percentage}
        label="Tokens"
        color={getColor(stats.tokens.percentage)}
        tooltipText={`${stats.tokens.usedDisplay} / ${stats.tokens.totalDisplay}`}
        showPercentage
      />
      
      <StatCircle
        value={stats.images.used}
        label="Images"
        color={getColor(stats.images.percentage)}
        tooltipText={`${stats.images.used} / ${stats.images.total} credits`}
      />
    </div>
  );
}
