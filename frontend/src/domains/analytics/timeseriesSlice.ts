import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TimeseriesState, TimeseriesDataPoint } from '@/shared/types';
import { apiClient, USE_MOCK } from '@/shared/api/client';
import { generateMockTimeseries } from '@/shared/api/mockData';
import { RootState } from '@/app/store';

const initialState: TimeseriesState = {
  data: [],
  status: 'idle',
  error: null,
};

export const fetchTimeseries = createAsyncThunk(
  'timeseries/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { dateFrom, dateTo, orderStatus, customerState, category, sellerId } = state.filters;
      
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return generateMockTimeseries(dateFrom, dateTo);
      }
      
      const params = new URLSearchParams({
        from: dateFrom,
        to: dateTo,
        ...(orderStatus && { status: orderStatus }),
        ...(customerState && { state: customerState }),
        ...(category && { category }),
        ...(sellerId && { seller_id: sellerId }),
      });
      
      const response = await apiClient.get<TimeseriesDataPoint[]>(`/api/v1/metrics/sales-by-day?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const timeseriesSlice = createSlice({
  name: 'timeseries',
  initialState,
  reducers: {
    clearTimeseries: (state) => {
      state.data = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeseries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTimeseries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTimeseries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearTimeseries } = timeseriesSlice.actions;
export default timeseriesSlice.reducer;
