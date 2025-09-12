import { Tooltip , TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
  
  export const StatCircle = ({ 
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
