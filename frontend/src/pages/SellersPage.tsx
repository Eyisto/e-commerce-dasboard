import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useRedux';
import { fetchRankings } from '@/domains/analytics/rankingsSlice';
import { setCustomerState } from '@/domains/filters/filtersSlice';
import { PageContainer } from '@/app/layout';
import { SelectFilter, LoadingSkeleton, ErrorBanner, KpiCard } from '@/shared/components';
import { Users, DollarSign, Star, Truck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

const stateOptions = [
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'PR', label: 'Paraná' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'BA', label: 'Bahia' },
  { value: 'GO', label: 'Goiás' },
];

const SellersPage = () => {
  const dispatch = useAppDispatch();
  const { dateFrom, dateTo, customerState } = useAppSelector((state) => state.filters);
  const { topSellers, status, error } = useAppSelector((state) => state.rankings);

  const loadData = () => {
    dispatch(fetchRankings());
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, customerState]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const isLoading = status === 'loading';

  // Calculate aggregate metrics
  const totalGmv = topSellers.reduce((sum, s) => sum + s.gmv, 0);
  const totalOrders = topSellers.reduce((sum, s) => sum + s.orders_count, 0);
  const avgReview = topSellers.reduce((sum, s) => sum + s.avg_review_score, 0) / (topSellers.length || 1);
  const avgLateRate = topSellers.reduce((sum, s) => sum + s.late_delivery_rate, 0) / (topSellers.length || 1);

  return (
    <PageContainer
      title="Sellers"
      subtitle="Seller performance and rankings"
      onRefresh={loadData}
      isLoading={isLoading}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 glass-card rounded-xl">
        <SelectFilter
          label="State"
          value={customerState}
          options={stateOptions}
          onChange={(val) => dispatch(setCustomerState(val))}
        />
      </div>

      {/* Error */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={loadData}
          className="mb-6"
        />
      )}

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Sellers"
          value={topSellers.length}
          format="number"
          icon={Users}
          isLoading={isLoading}
          className="animate-slide-up stagger-1"
        />
        <KpiCard
          title="Combined GMV"
          value={totalGmv}
          format="currency"
          icon={DollarSign}
          isLoading={isLoading}
          className="animate-slide-up stagger-2"
        />
        <KpiCard
          title="Avg Review Score"
          value={avgReview}
          format="score"
          icon={Star}
          isLoading={isLoading}
          className="animate-slide-up stagger-3"
        />
        <KpiCard
          title="Avg Late Rate"
          value={avgLateRate}
          format="percentage"
          icon={Truck}
          isLoading={isLoading}
          className="animate-slide-up stagger-4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* GMV by Seller */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">GMV by Seller</h3>
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topSellers}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="seller_id"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickFormatter={(val) => val.slice(-6)}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(val: number) => [formatCurrency(val), 'GMV']}
                />
                <Bar dataKey="gmv" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Review vs Late Rate Scatter */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Review Score vs Late Rate</h3>
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="avg_review_score"
                  name="Review Score"
                  domain={[3, 5]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Review Score', position: 'bottom', offset: 0, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  type="number"
                  dataKey="late_delivery_rate"
                  name="Late Rate"
                  domain={[0, 30]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Late Rate %', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                />
                <ZAxis type="number" dataKey="gmv" range={[50, 400]} name="GMV" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(val: number, name: string) => {
                    if (name === 'GMV') return [formatCurrency(val), name];
                    if (name === 'Late Rate') return [`${val.toFixed(1)}%`, name];
                    return [val.toFixed(2), name];
                  }}
                />
                <Scatter
                  data={topSellers}
                  fill="hsl(var(--accent))"
                  opacity={0.8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Sellers Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-foreground mb-6">Seller Rankings</h3>
        {isLoading ? (
          <LoadingSkeleton variant="table" rows={10} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="w-12">#</th>
                  <th>Seller ID</th>
                  <th>Location</th>
                  <th className="text-right">Orders</th>
                  <th className="text-right">GMV</th>
                  <th className="text-right">Avg Review</th>
                  <th className="text-right">Late Rate</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((seller, i) => (
                  <tr key={seller.seller_id}>
                    <td className="font-medium text-muted-foreground">{i + 1}</td>
                    <td className="font-mono text-sm">{seller.seller_id}</td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm">{seller.seller_city}</span>
                        <span className="text-xs text-muted-foreground">{seller.seller_state}</span>
                      </div>
                    </td>
                    <td className="text-right">{seller.orders_count.toLocaleString()}</td>
                    <td className="text-right font-medium">{formatCurrency(seller.gmv)}</td>
                    <td className="text-right">
                      <span className={`inline-flex items-center gap-1 ${seller.avg_review_score >= 4.5 ? 'text-success' : seller.avg_review_score >= 4 ? 'text-warning' : 'text-destructive'}`}>
                        <Star className="h-3 w-3 fill-current" />
                        {seller.avg_review_score.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${seller.late_delivery_rate <= 10 ? 'bg-success/20 text-success' : seller.late_delivery_rate <= 20 ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'}`}>
                        {seller.late_delivery_rate.toFixed(1)}%
                      </span>
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

export default SellersPage;
