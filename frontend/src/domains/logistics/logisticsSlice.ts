import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LogisticsState, LogisticsData } from '@/shared/types';
import { apiClient, USE_MOCK } from '@/shared/api/client';
import { generateMockLogistics } from '@/shared/api/mockData';
import { RootState } from '@/app/store';

const initialState: LogisticsState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchLogistics = createAsyncThunk(
  'logistics/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { dateFrom, dateTo, orderStatus, customerState } = state.filters;
      
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return generateMockLogistics(dateFrom, dateTo);
      }
      
      const params = new URLSearchParams({
        from: dateFrom,
        to: dateTo,
        ...(orderStatus && { status: orderStatus }),
        ...(customerState && { state: customerState }),
      });
      
      const response = await apiClient.get<LogisticsData>(`/api/v1/metrics/logistics?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const logisticsSlice = createSlice({
  name: 'logistics',
  initialState,
  reducers: {
    clearLogistics: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogistics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLogistics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLogistics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearLogistics } = logisticsSlice.actions;
export default logisticsSlice.reducer;
