import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useRedux';
import { fetchKpis } from '@/domains/analytics/kpisSlice';
import { fetchTimeseries } from '@/domains/analytics/timeseriesSlice';
import { fetchRankings } from '@/domains/analytics/rankingsSlice';
import { PageContainer } from '@/app/layout';
import { KpiCard, ErrorBanner, LoadingSkeleton, SelectFilter } from '@/shared/components';
import { setOrderStatus, setCustomerState, setCategory, resetFilters } from '@/domains/filters/filtersSlice';
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Star,
  Truck,
} from 'lucide-react';
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
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const orderStatusOptions = [
  { value: 'delivered', label: 'Delivered' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'processing', label: 'Processing' },
  { value: 'canceled', label: 'Canceled' },
];

const stateOptions = [
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'PR', label: 'Paraná' },
];

const categoryOptions = [
  { value: 'cama_mesa_banho', label: 'Bed/Bath/Table' },
  { value: 'beleza_saude', label: 'Health & Beauty' },
  { value: 'esporte_lazer', label: 'Sports & Leisure' },
  { value: 'informatica_acessorios', label: 'Computers' },
  { value: 'moveis_decoracao', label: 'Furniture' },
];

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { dateFrom, dateTo, orderStatus, customerState, category } = useAppSelector((state) => state.filters);
  const kpis = useAppSelector((state) => state.kpis);
  const timeseries = useAppSelector((state) => state.timeseries);
  const rankings = useAppSelector((state) => state.rankings);

  const loadData = () => {
    dispatch(fetchKpis());
    dispatch(fetchTimeseries());
    dispatch(fetchRankings());
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, orderStatus, customerState, category]);

  const isLoading = kpis.status === 'loading' || timeseries.status === 'loading';
  const hasError = kpis.error || timeseries.error || rankings.error;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Overview of your e-commerce performance"
      onRefresh={loadData}
      isLoading={isLoading}
    >
      {/* Filters Bar */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 glass-card rounded-xl">
        <SelectFilter
          label="Order Status"
          value={orderStatus}
          options={orderStatusOptions}
          onChange={(val) => dispatch(setOrderStatus(val))}
        />
        <SelectFilter
          label="Customer State"
          value={customerState}
          options={stateOptions}
          onChange={(val) => dispatch(setCustomerState(val))}
        />
        <SelectFilter
          label="Category"
          value={category}
          options={categoryOptions}
          onChange={(val) => dispatch(setCategory(val))}
        />
        <button
          onClick={() => dispatch(resetFilters())}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Error Banner */}
      {hasError && (
        <ErrorBanner
          message={kpis.error || timeseries.error || rankings.error || 'Failed to load data'}
          onRetry={loadData}
          className="mb-6"
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <KpiCard
          title="GMV"
          value={kpis.data?.gmv || 0}
          format="currency"
          icon={DollarSign}
          isLoading={kpis.status === 'loading'}
          delta={12.5}
          deltaLabel="vs last period"
          className="animate-slide-up stagger-1"
        />
        <KpiCard
          title="Orders"
          value={kpis.data?.orders_count || 0}
          format="number"
          icon={ShoppingCart}
          isLoading={kpis.status === 'loading'}
          delta={8.2}
          deltaLabel="vs last period"
          className="animate-slide-up stagger-2"
        />
        <KpiCard
          title="Items Sold"
          value={kpis.data?.items_sold || 0}
          format="number"
          icon={Package}
          isLoading={kpis.status === 'loading'}
          delta={15.3}
          deltaLabel="vs last period"
          className="animate-slide-up stagger-3"
        />
        <KpiCard
          title="AOV"
          value={kpis.data?.aov || 0}
          format="currency"
          icon={TrendingUp}
          isLoading={kpis.status === 'loading'}
          delta={3.8}
          deltaLabel="vs last period"
          className="animate-slide-up stagger-4"
        />
        <KpiCard
          title="Avg Review"
          value={kpis.data?.avg_review_score || 0}
          format="score"
          icon={Star}
          isLoading={kpis.status === 'loading'}
          delta={0.2}
          deltaLabel="vs last period"
          className="animate-slide-up stagger-5"
        />
        <KpiCard
          title="Late Delivery"
          value={kpis.data?.late_delivery_rate || 0}
          format="percentage"
          icon={Truck}
          isLoading={kpis.status === 'loading'}
          delta={-2.1}
          deltaLabel="vs last period"
          className="animate-slide-up stagger-6"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales by Day Chart */}
        <div className="lg:col-span-2 chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Sales by Day</h3>
          {timeseries.status === 'loading' ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeseries.data}>
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
                  tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  labelFormatter={(val) => new Date(val).toLocaleDateString('pt-BR')}
                  formatter={(val: number) => [formatCurrency(val), 'GMV']}
                />
                <Line 
                  type="monotone" 
                  dataKey="gmv" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Categories Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Sales by Category</h3>
          {rankings.status === 'loading' ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rankings.topCategories.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis 
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  type="category"
                  dataKey="category_english"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={100}
                  tickFormatter={(val) => val.replace(/_/g, ' ')}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(val: number) => [formatCurrency(val), 'GMV']}
                />
                <Bar 
                  dataKey="gmv" 
                  fill="hsl(var(--accent))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Rankings Tabs */}
      <div className="chart-container">
        <Tabs defaultValue="products">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Rankings</h3>
            <TabsList className="bg-secondary">
              <TabsTrigger value="products">Top 10 Products</TabsTrigger>
              <TabsTrigger value="sellers">Top 10 Sellers</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products">
            {rankings.status === 'loading' ? (
              <LoadingSkeleton variant="table" rows={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th>#</th>
                      <th>Product ID</th>
                      <th>Category</th>
                      <th className="text-right">Units Sold</th>
                      <th className="text-right">GMV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.topProducts.map((product, i) => (
                      <tr key={product.product_id}>
                        <td className="font-medium text-muted-foreground">{i + 1}</td>
                        <td className="font-mono text-sm">{product.product_id}</td>
                        <td className="capitalize">{product.category_english?.replace(/_/g, ' ') || product.category}</td>
                        <td className="text-right">{product.total_sold.toLocaleString()}</td>
                        <td className="text-right font-medium">{formatCurrency(product.gmv)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sellers">
            {rankings.status === 'loading' ? (
              <LoadingSkeleton variant="table" rows={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th>#</th>
                      <th>Seller ID</th>
                      <th>Location</th>
                      <th className="text-right">Orders</th>
                      <th className="text-right">GMV</th>
                      <th className="text-right">Avg Review</th>
                      <th className="text-right">Late Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.topSellers.map((seller, i) => (
                      <tr key={seller.seller_id}>
                        <td className="font-medium text-muted-foreground">{i + 1}</td>
                        <td className="font-mono text-sm">{seller.seller_id}</td>
                        <td>{seller.seller_city}, {seller.seller_state}</td>
                        <td className="text-right">{seller.orders_count.toLocaleString()}</td>
                        <td className="text-right font-medium">{formatCurrency(seller.gmv)}</td>
                        <td className="text-right">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 text-warning" />
                            {seller.avg_review_score.toFixed(2)}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className={seller.late_delivery_rate > 15 ? 'text-destructive' : 'text-success'}>
                            {seller.late_delivery_rate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
