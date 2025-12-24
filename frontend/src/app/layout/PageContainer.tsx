import { ReactNode } from 'react';
import { Topbar } from './Topbar';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  children: ReactNode;
}

export const PageContainer = ({
  title,
  subtitle,
  onRefresh,
  isLoading,
  children,
}: PageContainerProps) => {
  return (
    <div className="min-h-screen">
      <Topbar
        title={title}
        subtitle={subtitle}
        onRefresh={onRefresh}
        isLoading={isLoading}
      />
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
