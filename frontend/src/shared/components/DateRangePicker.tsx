import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  from: string;
  to: string;
  min?: string;
  max?: string;
  onChange: (from: string, to: string) => void;
  className?: string;
}

export const DateRangePicker = ({
  from,
  to,
  min,
  max,
  onChange,
  className,
}: DateRangePickerProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <input
          type="date"
          value={from}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value, to)}
          className="bg-transparent text-sm text-foreground outline-none w-32"
        />
      </div>
      
      <span className="text-muted-foreground">to</span>
      
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <input
          type="date"
          value={to}
          min={min}
          max={max}
          onChange={(e) => onChange(from, e.target.value)}
          className="bg-transparent text-sm text-foreground outline-none w-32"
        />
      </div>
    </div>
  );
};
