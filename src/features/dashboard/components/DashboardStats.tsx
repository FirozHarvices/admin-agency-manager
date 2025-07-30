import { Card } from '../../../components/ui/Card';
import { AgencyData, DashboardStat } from '../types';
import { Globe, Cpu, HardDrive, Images } from 'lucide-react';
import { useMemo } from 'react';

const formatNumber = (num: number) => {
  if (!Number.isInteger(num)) {
    return num.toFixed(2);
  }
  
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  
  return num;
};

const StatCard = ({ stat, unit }: { stat: DashboardStat, unit?: string }) => (
    <Card className="flex items-center gap-4"> 
    <div className="p-3 rounded-lg bg-brand-primary-light">
      <stat.icon className="h-6 w-6 text-brand-primary" />
    </div>
    <div>
      <p className="text-lg font-bold text-brand-text-primary">
        {formatNumber(stat.value)}
        <span className="text-sm font-normal text-brand-text-secondary">
            /{formatNumber(stat.total)}{unit && <span className="ml-1">{unit}</span>}
        </span>
      </p>
      <p className="text-sm text-brand-text-secondary">{stat.label}</p>
    </div>
  </Card>
);

const LoadingStatCard = () => (
    <Card className="flex items-center gap-4 animate-pulse">
        <div className="p-3 rounded-lg bg-gray-200 h-12 w-12"></div>
        <div className='flex-1 space-y-2'>
            <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
    </Card>
);

interface DashboardStatsProps {
  data?: AgencyData;
  isLoading: boolean;
}

export function DashboardStats({ data, isLoading }: DashboardStatsProps) {
  const stats: DashboardStat[] = useMemo(() => {
    if (!data) return [];
    
    const usedWebsites = data.total_website_count - data.remaining_website_count;
    const usedTokens = data.total_ai_token - data.remaining_ai_token;

    // Assuming the 50GB plan, 50 * 1024 = 51200 MB
    const totalStorageMb = data.total_storage ?? 51200; 
    const usedSpaceMb = totalStorageMb - data.remaining_storage;
    
    return [
      { id: 'websites', label: 'Total Websites', value: usedWebsites, total: data.total_website_count, icon: Globe },
      { id: 'tokens', label: 'Used Tokens', value: usedTokens, total: data.total_ai_token, icon: Cpu },
      { id: 'space', label: 'Used Space', value: usedSpaceMb / 1024, total: totalStorageMb / 1024, icon: HardDrive },
      { id: 'images', label: 'AI Images', value: data.remaining_image_count, total: data.total_images, icon: Images },
    ];
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <LoadingStatCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} unit={stat.id === 'space' ? 'GB' : undefined} />
      ))}
    </div>
  );
}