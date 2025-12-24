import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useRedux';
import { fetchLogistics } from '@/domains/logistics/logisticsSlice';
import { PageContainer } from '@/app/layout';
import { KpiCard, LoadingSkeleton, ErrorBanner } from '@/shared/components';
import { Truck, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const LogisticsPage = () => {
  const dispatch = useAppDispatch();
  const { dateFrom, dateTo } = useAppSelector((state) => state.filters);
  const { data, status, error } = useAppSelector((state) => state.logistics);

  const loadData = () => {
    dispatch(fetchLogistics());
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo]);

  const isLoading = status === 'loading';

  return (
    <PageContainer
      title="Logistics"
      subtitle="Delivery performance and lead times"
      onRefresh={loadData}
      isLoading={isLoading}
    >
      {/* Error */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={loadData}
          className="mb-6"
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Avg Lead Time"
          value={data?.avgLeadTimeDays || 0}
          format="number"
          icon={Clock}
          isLoading={isLoading}
          deltaLabel="days"
          className="animate-slide-up stagger-1"
        />
        <KpiCard
          title="Avg Delay"
          value={data?.avgDelayDays || 0}
          format="number"
          icon={Truck}
          isLoading={isLoading}
          deltaLabel="days"
          className="animate-slide-up stagger-2"
        />
        <KpiCard
          title="On-Time Orders"
          value={data?.onTimeOrdersCount || 0}
          format="number"
          icon={CheckCircle}
          isLoading={isLoading}
          className="animate-slide-up stagger-3"
        />
        <KpiCard
          title="Late Orders"
          value={data?.lateOrdersCount || 0}
          format="number"
          icon={AlertTriangle}
          isLoading={isLoading}
          className="animate-slide-up stagger-4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Late Rate by Day */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Delivery Performance by Day</h3>
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data?.deliveryByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString('pt-BR')}
                  formatter={(val: number, name: string) => [`${val.toFixed(1)}%`, name === 'onTimeRate' ? 'On-Time' : 'Late']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="onTimeRate"
                  name="On-Time Rate"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lateRate"
                  name="Late Rate"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Lead Time by State */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Lead Time by State</h3>
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data?.deliveryByState || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Days', position: 'bottom', offset: 0, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(val: number, name: string) => [`${val.toFixed(1)} days`, name === 'avgLeadTime' ? 'Lead Time' : 'Avg Delay']}
                />
                <Legend />
                <Bar dataKey="avgLeadTime" name="Avg Lead Time" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="avgDelay" name="Avg Delay" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* State Details Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-foreground mb-6">Delivery Metrics by State</h3>
        {isLoading ? (
          <LoadingSkeleton variant="table" rows={10} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-secondary/50">
                  <th>State</th>
                  <th className="text-right">Avg Lead Time (days)</th>
                  <th className="text-right">Avg Delay (days)</th>
                  <th className="text-right">Performance</th>
                </tr>
              </thead>
              <tbody>
                {data?.deliveryByState.map((state) => (
                  <tr key={state.state}>
                    <td className="font-medium">{state.state}</td>
                    <td className="text-right">{state.avgLeadTime.toFixed(1)}</td>
                    <td className="text-right">
                      <span className={state.avgDelay <= 1 ? 'text-success' : state.avgDelay <= 3 ? 'text-warning' : 'text-destructive'}>
                        {state.avgDelay.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="w-full bg-muted rounded-full h-2 max-w-[100px] ml-auto">
                        <div
                          className={`h-2 rounded-full ${state.avgDelay <= 1 ? 'bg-success' : state.avgDelay <= 3 ? 'bg-warning' : 'bg-destructive'}`}
                          style={{ width: `${Math.max(10, 100 - state.avgDelay * 15)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default LogisticsPage;
