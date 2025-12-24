import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: LucideIcon;
  format?: 'currency' | 'number' | 'percentage' | 'score';
  isLoading?: boolean;
  className?: string;
}

export const KpiCard = ({
  title,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  format = 'number',
  isLoading = false,
  className,
}: KpiCardProps) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'score':
        return val.toFixed(2);
      default:
        return new Intl.NumberFormat('pt-BR').format(val);
    }
  };

  const isPositiveDelta = delta !== undefined && delta >= 0;

  if (isLoading) {
    return (
      <div className={cn('kpi-card', className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn('kpi-card group', className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <span className="text-3xl font-bold text-foreground">
          {formatValue(value)}
        </span>
      </div>
      
      {delta !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-medium px-2 py-0.5 rounded-full',
              isPositiveDelta
                ? 'bg-success/20 text-success'
                : 'bg-destructive/20 text-destructive'
            )}
          >
            {isPositiveDelta ? '+' : ''}{delta.toFixed(1)}%
          </span>
          {deltaLabel && (
            <span className="text-xs text-muted-foreground">
              {deltaLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
