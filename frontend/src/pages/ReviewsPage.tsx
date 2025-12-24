import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useRedux';
import { fetchReviews } from '@/domains/reviews/reviewsSlice';
import { PageContainer } from '@/app/layout';
import { KpiCard, LoadingSkeleton, ErrorBanner } from '@/shared/components';
import { Star, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const SCORE_COLORS = {
  5: 'hsl(142, 76%, 36%)',
  4: 'hsl(173, 80%, 40%)',
  3: 'hsl(38, 92%, 50%)',
  2: 'hsl(25, 95%, 53%)',
  1: 'hsl(0, 72%, 51%)',
};

const ReviewsPage = () => {
  const dispatch = useAppDispatch();
  const { dateFrom, dateTo, category } = useAppSelector((state) => state.filters);
  const { data, status, error } = useAppSelector((state) => state.reviews);

  const loadData = () => {
    dispatch(fetchReviews());
  };

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo, category]);

  const isLoading = status === 'loading';

  const totalReviews = data?.scoreDistribution.reduce((sum, d) => sum + d.count, 0) || 0;

  return (
    <PageContainer
      title="Reviews"
      subtitle="Customer feedback and ratings analysis"
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
          title="Average Score"
          value={data?.avgScore || 0}
          format="score"
          icon={Star}
          isLoading={isLoading}
          className="animate-slide-up stagger-1"
        />
        <KpiCard
          title="Total Reviews"
          value={totalReviews}
          format="number"
          icon={MessageSquare}
          isLoading={isLoading}
          className="animate-slide-up stagger-2"
        />
        <KpiCard
          title="5-Star Reviews"
          value={data?.scoreDistribution.find(d => d.score === 5)?.percentage || 0}
          format="percentage"
          icon={TrendingUp}
          isLoading={isLoading}
          className="animate-slide-up stagger-3"
        />
        <KpiCard
          title="1-Star Reviews"
          value={data?.scoreDistribution.find(d => d.score === 1)?.percentage || 0}
          format="percentage"
          icon={TrendingDown}
          isLoading={isLoading}
          className="animate-slide-up stagger-4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Score Distribution Bar Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Score Distribution</h3>
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data?.scoreDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="score"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(val) => `${val} ⭐`}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(val: number, name: string, props: any) => [
                    `${val.toLocaleString()} reviews (${props.payload.percentage}%)`,
                    `${props.payload.score} Stars`
                  ]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data?.scoreDistribution.map((entry) => (
                    <Cell key={`cell-${entry.score}`} fill={SCORE_COLORS[entry.score as keyof typeof SCORE_COLORS]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Score Distribution Pie Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6">Distribution Breakdown</h3>
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={data?.scoreDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="count"
                  label={({ score, percentage }) => `${score}★ ${percentage}%`}
                  labelLine={false}
                >
                  {data?.scoreDistribution.map((entry) => (
                    <Cell key={`cell-${entry.score}`} fill={SCORE_COLORS[entry.score as keyof typeof SCORE_COLORS]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(val: number, name: string, props: any) => [
                    `${val.toLocaleString()} reviews`,
                    `${props.payload.score} Stars`
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Categories */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Top Rated Categories
          </h3>
          {isLoading ? (
            <LoadingSkeleton variant="table" rows={5} />
          ) : (
            <div className="space-y-3">
              {data?.topBestCategories.map((cat, i) => (
                <div key={cat.category} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground capitalize">
                      {cat.category_english?.replace(/_/g, ' ') || cat.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{cat.avg_score.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Worst Categories */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" />
            Lowest Rated Categories
          </h3>
          {isLoading ? (
            <LoadingSkeleton variant="table" rows={5} />
          ) : (
            <div className="space-y-3">
              {data?.topWorstCategories.map((cat, i) => (
                <div key={cat.category} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground capitalize">
                      {cat.category_english?.replace(/_/g, ' ') || cat.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/20 text-warning">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{cat.avg_score.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default ReviewsPage;
