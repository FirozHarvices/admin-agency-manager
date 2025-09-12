import { StatCircle } from "../../../components/StatCircle";

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

  const getColor = (percentage: number) => {
    if (percentage >= 80) return "#EF4444"; // red
    if (percentage >= 60) return "#F59E0B"; // orange/yellow  
    return "#10B981"; // green
  };

  return (
    <div className="flex items-center gap-6">
      <StatCircle
        value={stats.websites.percentage}
        label="Website"
        color={getColor(stats.websites.percentage)}
        tooltipText={`${stats.websites.used} / ${stats.websites.total} sites`}
        showPercentage
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
        value={stats.images.percentage}
        label="Images"
        color={getColor(stats.images.percentage)}
        tooltipText={`${stats.images.used} / ${stats.images.total} credits`}
        showPercentage
      />
    </div>
  );
}
