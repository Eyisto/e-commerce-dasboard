import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'chart' | 'text' | 'inline';
  rows?: number;
  className?: string;
}

export const LoadingSkeleton = ({
  variant = 'card',
  rows = 5,
  className,
}: LoadingSkeletonProps) => {
  if (variant === 'card') {
    return (
      <div className={cn('glass-card rounded-xl p-6 space-y-4', className)}>
        <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
        <div className="h-8 w-2/3 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('glass-card rounded-xl p-6', className)}>
        <div className="space-y-3">
          <div className="h-10 bg-muted rounded animate-pulse" />
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn('glass-card rounded-xl p-6', className)}>
        <div className="h-4 w-1/4 bg-muted rounded animate-pulse mb-6" />
        <div className="h-64 bg-muted/30 rounded animate-pulse flex items-end justify-around gap-2 p-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted rounded animate-pulse"
              style={{
                width: '12%',
                height: `${Math.random() * 60 + 20}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return <div className={cn('h-4 w-20 bg-muted rounded animate-pulse inline-block', className)} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};
