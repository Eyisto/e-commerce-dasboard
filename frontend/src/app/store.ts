import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/domains/auth/authSlice';
import filtersReducer from '@/domains/filters/filtersSlice';
import kpisReducer from '@/domains/analytics/kpisSlice';
import timeseriesReducer from '@/domains/analytics/timeseriesSlice';
import rankingsReducer from '@/domains/analytics/rankingsSlice';
import ordersReducer from '@/domains/orders/ordersSlice';
import logisticsReducer from '@/domains/logistics/logisticsSlice';
import reviewsReducer from '@/domains/reviews/reviewsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    kpis: kpisReducer,
    timeseries: timeseriesReducer,
    rankings: rankingsReducer,
    orders: ordersReducer,
    logistics: logisticsReducer,
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
