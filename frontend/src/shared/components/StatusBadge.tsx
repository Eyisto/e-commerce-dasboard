import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  delivered: 'bg-success/20 text-success',
  shipped: 'bg-info/20 text-info',
  processing: 'bg-warning/20 text-warning',
  invoiced: 'bg-accent/20 text-accent',
  canceled: 'bg-destructive/20 text-destructive',
  unavailable: 'bg-muted text-muted-foreground',
  created: 'bg-primary/20 text-primary',
  approved: 'bg-success/20 text-success',
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const style = statusStyles[status.toLowerCase()] || 'bg-muted text-muted-foreground';
  
  return (
    <span className={cn('status-badge capitalize', style, className)}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
