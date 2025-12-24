import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OrdersState, Order } from '@/shared/types';
import { apiClient, USE_MOCK } from '@/shared/api/client';
import { generateMockOrders } from '@/shared/api/mockData';
import { RootState } from '@/app/store';

const initialState: OrdersState = {
  data: [],
  totalCount: 0,
  page: 1,
  pageSize: 20,
  status: 'idle',
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetch',
  async ({ page, pageSize }: { page: number; pageSize: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { dateFrom, dateTo, orderStatus, customerState } = state.filters;
      
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const result = generateMockOrders(dateFrom, dateTo, orderStatus, customerState, page, pageSize);
        return { ...result, page, pageSize };
      }
      
      const params = new URLSearchParams({
        from: dateFrom,
        to: dateTo,
        page: String(page),
        page_size: String(pageSize),
        ...(orderStatus && { status: orderStatus }),
        ...(customerState && { state: customerState }),
      });
      
      const response = await apiClient.get(`/api/v1/orders?${params}`);
      return { data: response.data.data, total: response.data.total, page, pageSize };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    clearOrders: (state) => {
      state.data = [];
      state.totalCount = 0;
      state.page = 1;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
        state.totalCount = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setPageSize, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
