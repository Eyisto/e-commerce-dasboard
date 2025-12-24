import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useRedux';
import { fetchRankings } from '@/domains/analytics/rankingsSlice';
import { setCategory } from '@/domains/filters/filtersSlice';
import { PageContainer } from '@/app/layout';
import { SelectFilter, LoadingSkeleton, ErrorBanner } from '@/shared/components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const categoryOptions = [
  { value: 'cama_mesa_banho', label: 'Bed/Bath/Table' },
  { value: 'beleza_saude', label: 'Health & Beauty' },
  { value: 'esporte_lazer', label: 'Sports & Leisure' },
  { value: 'informatica_acessorios', label: 'Computers' },
  { value: 'moveis_decoracao', label: 'Furniture' },
  { value: 'utilidades_domesticas', label: 'Housewares' },
  { value: 'relogios_presentes', label: 'Watches & Gifts' },
  { value: 'telefonia', label: 'Telephony' },
  { value: 'automotivo', label: 'Auto' },
  { value: 'brinquedos', label: 'Toys' },
];

const CHART_COLORS = [
  'hsl(173, 80%, 40%)',
  'hsl(262, 83%, 58%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(199, 89%, 48%)',
  'hsl(330, 81%, 60%)',
  'hsl(173, 80%, 50%)',
  'hsl(262, 83%, 68%)',
  'hsl(142, 76%, 46%)',
  'hsl(38, 92%, 60%)',
];

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { dateFrom, dateTo, category } = useAppSelector((state) => state.filters);
  const { topProducts, topCategories, status, error } = useAppSelector((state) => state.rankings);

  const loadData = () => {
    dispatch(fetchRankings());
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, category]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const isLoading = status === 'loading';

  return (
    <PageContainer
      title="Products"
      subtitle="Product performance and category analysis"
      onRefresh={loadData}
      isLoading={isLoading}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 glass-card rounded-xl">
        <SelectFilter
          label="Category"
          value={category}
          options={categoryOptions}
          onChange={(val) => dispatch(setCategory(val))}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales by Category Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Sales by Category</h3>
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topCategories} layout="vertical" margin={{ left: 20 }}>
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
                  width={120}
                  tickFormatter={(val) => val.replace(/_/g, ' ')}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(val: number, name: string) => [formatCurrency(val), name === 'gmv' ? 'GMV' : 'Units']}
                  labelFormatter={(val) => val.replace(/_/g, ' ')}
                />
                <Bar dataKey="gmv" radius={[0, 4, 4, 0]}>
                  {topCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Units Sold */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Units Sold by Category</h3>
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topCategories} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <YAxis
                  type="category"
                  dataKey="category_english"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={120}
                  tickFormatter={(val) => val.replace(/_/g, ' ')}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(val: number) => [val.toLocaleString(), 'Units Sold']}
                  labelFormatter={(val) => val.replace(/_/g, ' ')}
                />
                <Bar dataKey="total_sold" fill="hsl(var(--info))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-foreground mb-6">Top 10 Products</h3>
        {isLoading ? (
          <LoadingSkeleton variant="table" rows={10} />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="w-12">#</th>
                  <th>Product ID</th>
                  <th>Category</th>
                  <th className="text-right">Units Sold</th>
                  <th className="text-right">GMV</th>
                  <th className="text-right">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, i) => (
                  <tr key={product.product_id}>
                    <td className="font-medium text-muted-foreground">{i + 1}</td>
                    <td className="font-mono text-sm">{product.product_id}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent capitalize">
                        {product.category_english?.replace(/_/g, ' ') || product.category}
                      </span>
                    </td>
                    <td className="text-right">{product.total_sold.toLocaleString()}</td>
                    <td className="text-right font-medium">{formatCurrency(product.gmv)}</td>
                    <td className="text-right text-muted-foreground">
                      {formatCurrency(product.gmv / product.total_sold)}
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

export default ProductsPage;
