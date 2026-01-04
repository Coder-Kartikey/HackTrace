import { AlertCircle, Bug, Clock, Zap } from 'lucide-react';

interface PatternBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

const patternConfig: Record<
  string,
  { color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  NullPointerException: {
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    icon: Bug,
  },
  UnauthorizedError: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    icon: AlertCircle,
  },
  DatabaseTimeout: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    icon: Clock,
  },
  ValidationError: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    icon: AlertCircle,
  },
  NetworkError: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    icon: Zap,
  },
};

export function PatternBadge({ type, size = 'md' }: PatternBadgeProps) {
  const config = patternConfig[type] || {
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/10 border-zinc-500/20',
    icon: Bug,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <div
      className={`inline-flex items-center rounded-md border ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={`${config.color} ${iconSizes[size]}`} />
      <span className={config.color}>{type}</span>
    </div>
  );
}