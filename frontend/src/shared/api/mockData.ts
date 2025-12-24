import { 
  KpisData, 
  TimeseriesDataPoint, 
  TopProduct, 
  TopCategory, 
  TopSeller, 
  Order,
  LogisticsData,
  ReviewsData
} from '../types';

// Helper functions
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(randomBetween(min, max));

const brazilianStates = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'];
const orderStatuses = ['delivered', 'shipped', 'processing', 'canceled', 'invoiced'];
const categories = [
  { pt: 'cama_mesa_banho', en: 'bed_bath_table' },
  { pt: 'beleza_saude', en: 'health_beauty' },
  { pt: 'esporte_lazer', en: 'sports_leisure' },
  { pt: 'informatica_acessorios', en: 'computers_accessories' },
  { pt: 'moveis_decoracao', en: 'furniture_decor' },
  { pt: 'utilidades_domesticas', en: 'housewares' },
  { pt: 'relogios_presentes', en: 'watches_gifts' },
  { pt: 'telefonia', en: 'telephony' },
  { pt: 'automotivo', en: 'auto' },
  { pt: 'brinquedos', en: 'toys' },
];

// Generate dates between range
const getDaysBetween = (from: string, to: string): string[] => {
  const dates: string[] = [];
  const start = new Date(from);
  const end = new Date(to);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

// Mock KPIs
export const generateMockKpis = (from: string, to: string): KpisData => {
  const days = getDaysBetween(from, to).length;
  const baseOrders = days * randomInt(30, 50);
  const gmv = baseOrders * randomBetween(150, 250);
  
  return {
    gmv: Math.round(gmv * 100) / 100,
    orders_count: baseOrders,
    items_sold: Math.round(baseOrders * randomBetween(1.2, 1.8)),
    aov: Math.round((gmv / baseOrders) * 100) / 100,
    paid_total: Math.round(gmv * 0.95 * 100) / 100,
    avg_review_score: Math.round(randomBetween(3.8, 4.6) * 100) / 100,
    late_delivery_rate: Math.round(randomBetween(5, 25) * 100) / 100,
  };
};

// Mock Timeseries
export const generateMockTimeseries = (from: string, to: string): TimeseriesDataPoint[] => {
  const dates = getDaysBetween(from, to);
  
  return dates.map(date => ({
    date,
    gmv: Math.round(randomBetween(5000, 25000) * 100) / 100,
    orders_count: randomInt(20, 100),
  }));
};

// Mock Top Products
export const generateMockTopProducts = (): TopProduct[] => {
  return Array.from({ length: 10 }, (_, i) => {
    const cat = categories[randomInt(0, categories.length)];
    return {
      product_id: `prod_${String(i + 1).padStart(4, '0')}`,
      product_name: `Product ${i + 1}`,
      category: cat.pt,
      category_english: cat.en,
      total_sold: randomInt(100, 1000),
      gmv: Math.round(randomBetween(5000, 50000) * 100) / 100,
    };
  }).sort((a, b) => b.gmv - a.gmv);
};

// Mock Top Categories
export const generateMockTopCategories = (): TopCategory[] => {
  return categories.map(cat => ({
    category: cat.pt,
    category_english: cat.en,
    total_sold: randomInt(500, 5000),
    gmv: Math.round(randomBetween(50000, 500000) * 100) / 100,
  })).sort((a, b) => b.gmv - a.gmv);
};

// Mock Top Sellers
export const generateMockTopSellers = (): TopSeller[] => {
  return Array.from({ length: 10 }, (_, i) => {
    const state = brazilianStates[randomInt(0, brazilianStates.length)];
    return {
      seller_id: `seller_${String(i + 1).padStart(4, '0')}`,
      seller_city: `City ${i + 1}`,
      seller_state: state,
      orders_count: randomInt(50, 500),
      gmv: Math.round(randomBetween(10000, 100000) * 100) / 100,
      avg_review_score: Math.round(randomBetween(3.5, 5) * 100) / 100,
      late_delivery_rate: Math.round(randomBetween(2, 20) * 100) / 100,
    };
  }).sort((a, b) => b.gmv - a.gmv);
};

// Mock Orders
export const generateMockOrders = (
  from: string, 
  to: string, 
  status: string,
  state: string,
  page: number, 
  pageSize: number
): { data: Order[]; total: number } => {
  const dates = getDaysBetween(from, to);
  const totalOrders = randomInt(200, 500);
  
  const orders: Order[] = Array.from({ length: pageSize }, (_, i) => {
    const purchaseDate = dates[randomInt(0, dates.length)];
    const orderStatus = status || orderStatuses[randomInt(0, orderStatuses.length)];
    const customerState = state || brazilianStates[randomInt(0, brazilianStates.length)];
    
    const purchaseDateObj = new Date(purchaseDate);
    const estimatedDays = randomInt(7, 21);
    const estimatedDate = new Date(purchaseDateObj);
    estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);
    
    let deliveredDate: string | null = null;
    if (orderStatus === 'delivered') {
      const deliveryDays = randomInt(3, estimatedDays + 5);
      const deliveredDateObj = new Date(purchaseDateObj);
      deliveredDateObj.setDate(deliveredDateObj.getDate() + deliveryDays);
      deliveredDate = deliveredDateObj.toISOString().split('T')[0];
    }
    
    return {
      order_id: `ord_${String(page * pageSize + i + 1).padStart(6, '0')}`,
      order_status: orderStatus,
      purchase_date: purchaseDate,
      delivered_date: deliveredDate,
      estimated_date: estimatedDate.toISOString().split('T')[0],
      items_count: randomInt(1, 5),
      gmv: Math.round(randomBetween(50, 500) * 100) / 100,
      customer_state: customerState,
      customer_city: `City ${randomInt(1, 100)}`,
    };
  });
  
  return { data: orders, total: totalOrders };
};

// Mock Logistics
export const generateMockLogistics = (from: string, to: string): LogisticsData => {
  const dates = getDaysBetween(from, to);
  
  return {
    avgLeadTimeDays: Math.round(randomBetween(8, 15) * 10) / 10,
    avgDelayDays: Math.round(randomBetween(0.5, 3) * 10) / 10,
    lateOrdersCount: randomInt(100, 500),
    onTimeOrdersCount: randomInt(800, 2000),
    deliveryByDay: dates.map(date => ({
      date,
      lateRate: Math.round(randomBetween(5, 25) * 100) / 100,
      onTimeRate: Math.round(randomBetween(75, 95) * 100) / 100,
    })),
    deliveryByState: brazilianStates.map(state => ({
      state,
      avgLeadTime: Math.round(randomBetween(5, 20) * 10) / 10,
      avgDelay: Math.round(randomBetween(0, 5) * 10) / 10,
    })),
  };
};

// Mock Reviews
export const generateMockReviews = (): ReviewsData => {
  const total = randomInt(1000, 5000);
  const distribution = [
    { score: 5, count: Math.round(total * randomBetween(0.4, 0.6)) },
    { score: 4, count: Math.round(total * randomBetween(0.2, 0.3)) },
    { score: 3, count: Math.round(total * randomBetween(0.05, 0.15)) },
    { score: 2, count: Math.round(total * randomBetween(0.02, 0.08)) },
    { score: 1, count: Math.round(total * randomBetween(0.02, 0.08)) },
  ];
  
  const totalCount = distribution.reduce((sum, d) => sum + d.count, 0);
  const avgScore = distribution.reduce((sum, d) => sum + (d.score * d.count), 0) / totalCount;
  
  return {
    avgScore: Math.round(avgScore * 100) / 100,
    scoreDistribution: distribution.map(d => ({
      ...d,
      percentage: Math.round((d.count / totalCount) * 10000) / 100,
    })),
    topWorstCategories: categories.slice(0, 5).map(cat => ({
      category: cat.pt,
      category_english: cat.en,
      avg_score: Math.round(randomBetween(2.5, 3.8) * 100) / 100,
    })).sort((a, b) => a.avg_score - b.avg_score),
    topBestCategories: categories.slice(5, 10).map(cat => ({
      category: cat.pt,
      category_english: cat.en,
      avg_score: Math.round(randomBetween(4.2, 4.9) * 100) / 100,
    })).sort((a, b) => b.avg_score - a.avg_score),
  };
};
