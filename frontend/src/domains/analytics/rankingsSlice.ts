import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RankingsState, TopProduct, TopCategory, TopSeller } from '@/shared/types';
import { apiClient, USE_MOCK } from '@/shared/api/client';
import { generateMockTopProducts, generateMockTopCategories, generateMockTopSellers } from '@/shared/api/mockData';
import { RootState } from '@/app/store';

const initialState: RankingsState = {
  topProducts: [],
  topCategories: [],
  topSellers: [],
  status: 'idle',
  error: null,
};

export const fetchRankings = createAsyncThunk(
  'rankings/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { dateFrom, dateTo, orderStatus, customerState, category, sellerId } = state.filters;
      
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return {
          topProducts: generateMockTopProducts(),
          topCategories: generateMockTopCategories(),
          topSellers: generateMockTopSellers(),
        };
      }
      
      const params = new URLSearchParams({
        from: dateFrom,
        to: dateTo,
        ...(orderStatus && { status: orderStatus }),
        ...(customerState && { state: customerState }),
        ...(category && { category }),
        ...(sellerId && { seller_id: sellerId }),
      });
      
      const [productsRes, categoriesRes, sellersRes] = await Promise.all([
        apiClient.get<TopProduct[]>(`/api/v1/metrics/top-products?${params}`),
        apiClient.get<TopCategory[]>(`/api/v1/metrics/top-categories?${params}`),
        apiClient.get<TopSeller[]>(`/api/v1/metrics/top-sellers?${params}`),
      ]);
      
      return {
        topProducts: productsRes.data,
        topCategories: categoriesRes.data,
        topSellers: sellersRes.data,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const rankingsSlice = createSlice({
  name: 'rankings',
  initialState,
  reducers: {
    clearRankings: (state) => {
      state.topProducts = [];
      state.topCategories = [];
      state.topSellers = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRankings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRankings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topProducts = action.payload.topProducts;
        state.topCategories = action.payload.topCategories;
        state.topSellers = action.payload.topSellers;
      })
      .addCase(fetchRankings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearRankings } = rankingsSlice.actions;
export default rankingsSlice.reducer;
