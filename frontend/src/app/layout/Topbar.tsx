import { Download, RefreshCw } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/useRedux';
import { DateRangePicker } from '@/shared/components/DateRangePicker';
import { setDateRange } from '@/domains/filters/filtersSlice';
import { USE_MOCK } from '@/shared/api/client';
import { DATA_MIN_DATE, DATA_MAX_DATE } from '@/shared/constants/dates';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const Topbar = ({ title, subtitle, onRefresh, isLoading }: TopbarProps) => {
  const dispatch = useAppDispatch();
  const { dateFrom, dateTo } = useAppSelector((state) => state.filters);

  const handleDateChange = (from: string, to: string) => {
    dispatch(setDateRange({ from, to }));
  };

  const handleExport = async () => {
    // Generate CSV from current data
    const params = new URLSearchParams({
      from: dateFrom,
      to: dateTo,
    });

    if (USE_MOCK) {
      // Generate mock CSV
      const csvContent = generateMockCSV();
      downloadCSV(csvContent, `orders_${dateFrom}_${dateTo}.csv`);
    } else {
      // Real API call
      window.location.href = `/api/v1/exports/orders.csv?${params}`;
    }
  };

  const generateMockCSV = () => {
    const headers = ['order_id', 'status', 'purchase_date', 'gmv', 'customer_state'];
    const rows = Array.from({ length: 100 }, (_, i) => [
      `ord_${String(i + 1).padStart(6, '0')}`,
      'delivered',
      dateFrom,
      (Math.random() * 500 + 50).toFixed(2),
      'SP',
    ]);
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            min={DATA_MIN_DATE}
            max={DATA_MAX_DATE}
            onChange={handleDateChange}
          />

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>
    </header>
  );
};
