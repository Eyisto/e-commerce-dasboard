import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
  }[];
  isLoading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  expandedRow?: string | null;
  renderExpanded?: (item: T) => React.ReactNode;
  getRowId?: (item: T) => string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  page = 1,
  pageSize = 20,
  totalCount = 0,
  onPageChange,
  onRowClick,
  expandedRow,
  renderExpanded,
  getRowId,
  className,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalCount > pageSize;

  if (isLoading) {
    return (
      <div className={cn('glass-card rounded-xl overflow-hidden', className)}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-secondary/50">
                {columns.map((col, i) => (
                  <th key={i}>{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j}>
                      <div className="h-4 bg-muted rounded animate-pulse" style={{ width: `${Math.random() * 40 + 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('glass-card rounded-xl overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr className="bg-secondary/50">
              {columns.map((col, i) => (
                <th key={i} className={col.className}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
              const rowId = getRowId ? getRowId(item) : String(i);
              const isExpanded = expandedRow === rowId;
              
              return (
                <>
                  <tr
                    key={rowId}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      onRowClick && 'cursor-pointer',
                      isExpanded && 'bg-muted/50'
                    )}
                  >
                    {columns.map((col, j) => (
                      <td key={j} className={col.className}>
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                      </td>
                    ))}
                  </tr>
                  {isExpanded && renderExpanded && (
                    <tr key={`${rowId}-expanded`}>
                      <td colSpan={columns.length} className="p-0 bg-muted/30">
                        <div className="p-4 animate-slide-up">
                          {renderExpanded(item)}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="text-sm font-medium px-3">
              Page {page} of {totalPages}
            </span>
            
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
