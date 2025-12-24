import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FiltersState } from '@/shared/types';
import { DATA_MIN_DATE, DATA_MAX_DATE } from '@/shared/constants/dates';

const clampDate = (value: string) => {
  if (value < DATA_MIN_DATE) return DATA_MIN_DATE;
  if (value > DATA_MAX_DATE) return DATA_MAX_DATE;
  return value;
};

const maxDate = new Date(DATA_MAX_DATE);
const defaultFromDate = new Date(maxDate);
defaultFromDate.setDate(defaultFromDate.getDate() - 30);
const defaultFrom = clampDate(defaultFromDate.toISOString().split('T')[0]);

const initialState: FiltersState = {
  dateFrom: defaultFrom,
  dateTo: DATA_MAX_DATE,
  orderStatus: '',
  customerState: '',
  category: '',
  sellerId: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ from: string; to: string }>) => {
      let from = clampDate(action.payload.from);
      let to = clampDate(action.payload.to);
      if (from > to) {
        [from, to] = [to, from];
      }
      state.dateFrom = from;
      state.dateTo = to;
    },
    setOrderStatus: (state, action: PayloadAction<string>) => {
      state.orderStatus = action.payload;
    },
    setCustomerState: (state, action: PayloadAction<string>) => {
      state.customerState = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSellerId: (state, action: PayloadAction<string>) => {
      state.sellerId = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setDateRange,
  setOrderStatus,
  setCustomerState,
  setCategory,
  setSellerId,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
