import { useState } from 'react';
import { PageContainer } from '@/app/layout';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useRedux';
import { resetFilters } from '@/domains/filters/filtersSlice';
import { USE_MOCK, API_URL } from '@/shared/api/client';
import { Settings, Database, Palette, Bell, Shield, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const [mockEnabled] = useState(USE_MOCK);

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <PageContainer
      title="Settings"
      subtitle="Configure your dashboard preferences"
    >
      <div className="max-w-4xl space-y-6">
        {/* Data Source */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Data Source</h3>
              <p className="text-sm text-muted-foreground">Configure API connection settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-foreground">Mock Mode</p>
                <p className="text-sm text-muted-foreground">
                  Use simulated data instead of real API
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${mockEnabled ? 'text-success' : 'text-muted-foreground'}`}>
                  {mockEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <Switch checked={mockEnabled} disabled />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-foreground">API URL</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {API_URL}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-info/20 text-info">
                {mockEnabled ? 'Not in use' : 'Connected'}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-info/10 border border-info/30">
              <p className="text-sm text-info">
                <strong>Environment Variables:</strong> Set <code className="px-1 py-0.5 rounded bg-info/20">VITE_USE_MOCK=true</code> to enable mock mode, 
                or <code className="px-1 py-0.5 rounded bg-info/20">VITE_API_URL</code> to change the API endpoint.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Filters</h3>
              <p className="text-sm text-muted-foreground">Manage global filter settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Date From</p>
                <p className="font-mono text-sm">{filters.dateFrom}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Date To</p>
                <p className="font-mono text-sm">{filters.dateTo}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Order Status</p>
                <p className="font-mono text-sm">{filters.orderStatus || 'All'}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Customer State</p>
                <p className="font-mono text-sm">{filters.customerState || 'All'}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Category</p>
                <p className="font-mono text-sm">{filters.category || 'All'}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Seller ID</p>
                <p className="font-mono text-sm">{filters.sellerId || 'All'}</p>
              </div>
            </div>

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Visual Settings */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Visual Settings</h3>
              <p className="text-sm text-muted-foreground">Customize appearance preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Dashboard uses dark theme by default
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-foreground">Animations</p>
                <p className="text-sm text-muted-foreground">
                  Enable smooth transitions and effects
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-xl p-6 opacity-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-info/10 text-info">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card rounded-xl p-6 opacity-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Security</h3>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
