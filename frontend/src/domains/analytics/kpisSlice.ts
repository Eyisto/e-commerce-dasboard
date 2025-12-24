import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { KpisState, KpisData } from '@/shared/types';
import { apiClient, USE_MOCK } from '@/shared/api/client';
import { generateMockKpis } from '@/shared/api/mockData';
import { RootState } from '@/app/store';

const initialState: KpisState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchKpis = createAsyncThunk(
  'kpis/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { dateFrom, dateTo, orderStatus, customerState, category, sellerId } = state.filters;
      
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return generateMockKpis(dateFrom, dateTo);
      }
      
      const params = new URLSearchParams({
        from: dateFrom,
        to: dateTo,
        ...(orderStatus && { status: orderStatus }),
        ...(customerState && { state: customerState }),
        ...(category && { category }),
        ...(sellerId && { seller_id: sellerId }),
      });
      
      const response = await apiClient.get<KpisData>(`/api/v1/metrics/kpis?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const kpisSlice = createSlice({
  name: 'kpis',
  initialState,
  reducers: {
    clearKpis: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpis.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchKpis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchKpis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearKpis } = kpisSlice.actions;
export default kpisSlice.reducer;
