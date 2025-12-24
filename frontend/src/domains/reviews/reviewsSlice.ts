import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewsState, ReviewsData } from '@/shared/types';
import { apiClient, USE_MOCK } from '@/shared/api/client';
import { generateMockReviews } from '@/shared/api/mockData';
import { RootState } from '@/app/store';

const initialState: ReviewsState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchReviews = createAsyncThunk(
  'reviews/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { dateFrom, dateTo, category } = state.filters;
      
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateMockReviews();
      }
      
      const params = new URLSearchParams({
        from: dateFrom,
        to: dateTo,
        ...(category && { category }),
      });
      
      const response = await apiClient.get<ReviewsData>(`/api/v1/metrics/reviews?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
