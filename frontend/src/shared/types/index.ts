// Common status types
export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
}

// Auth types
export interface AuthState {
  token: string | null;
  user: User | null;
  status: AsyncStatus;
  error: string | null;
}

// Filter types
export interface FiltersState {
  dateFrom: string;
  dateTo: string;
  orderStatus: string;
  customerState: string;
  category: string;
  sellerId: string;
}

// KPI types
export interface KpisData {
  gmv: number;
  orders_count: number;
  items_sold: number;
  aov: number;
  paid_total: number;
  avg_review_score: number;
  late_delivery_rate: number;
}

export interface KpisState {
  data: KpisData | null;
  status: AsyncStatus;
  error: string | null;
}

// Timeseries types
export interface TimeseriesDataPoint {
  date: string;
  gmv: number;
  orders_count: number;
}

export interface TimeseriesState {
  data: TimeseriesDataPoint[];
  status: AsyncStatus;
  error: string | null;
}

// Rankings types
export interface TopProduct {
  product_id: string;
  product_name: string;
  category: string;
  category_english: string;
  total_sold: number;
  gmv: number;
}

export interface TopCategory {
  category: string;
  category_english: string;
  total_sold: number;
  gmv: number;
}

export interface TopSeller {
  seller_id: string;
  seller_city: string;
  seller_state: string;
  orders_count: number;
  gmv: number;
  avg_review_score: number;
  late_delivery_rate: number;
}

export interface RankingsState {
  topProducts: TopProduct[];
  topCategories: TopCategory[];
  topSellers: TopSeller[];
  status: AsyncStatus;
  error: string | null;
}

// Order types
export interface Order {
  order_id: string;
  order_status: string;
  purchase_date: string;
  delivered_date: string | null;
  estimated_date: string;
  items_count: number;
  gmv: number;
  customer_state: string;
  customer_city: string;
}

export interface OrdersState {
  data: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
  status: AsyncStatus;
  error: string | null;
}

// Logistics types
export interface LogisticsData {
  avgLeadTimeDays: number;
  avgDelayDays: number;
  lateOrdersCount: number;
  onTimeOrdersCount: number;
  deliveryByDay: { date: string; lateRate: number; onTimeRate: number }[];
  deliveryByState: { state: string; avgLeadTime: number; avgDelay: number }[];
}

export interface LogisticsState {
  data: LogisticsData | null;
  status: AsyncStatus;
  error: string | null;
}

// Reviews types
export interface ReviewsData {
  avgScore: number;
  scoreDistribution: { score: number; count: number; percentage: number }[];
  topWorstCategories: { category: string; category_english: string; avg_score: number }[];
  topBestCategories: { category: string; category_english: string; avg_score: number }[];
}

export interface ReviewsState {
  data: ReviewsData | null;
  status: AsyncStatus;
  error: string | null;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
