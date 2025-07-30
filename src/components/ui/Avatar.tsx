import { cn } from '../../lib/utils';

interface AvatarProps {
  name: string;
  className?: string;
}

const getInitials = (name: string = ''): string => {
  const words = name.split(' ').filter(Boolean);
  if (words.length === 0) return '?';
  const firstInitial = words[0][0];
  const lastInitial = words.length > 1 ? words[words.length - 1][0] : '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export const Avatar = ({ name, className }: AvatarProps) => {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-brand-primary',
        className
      )}
    >
      <span className="text-sm">{initials}</span>
    </div>
  );
};