import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectFilterProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SelectFilter = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'All',
  className,
}: SelectFilterProps) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full px-3 py-2 pr-8 rounded-lg bg-secondary border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
};
