import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorBanner = ({
  message,
  onRetry,
  onDismiss,
  className,
}: ErrorBannerProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10',
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
      <p className="flex-1 text-sm text-foreground">{message}</p>
      
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
