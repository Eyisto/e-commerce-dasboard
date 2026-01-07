import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/shared/types';
import { apiClient } from '@/shared/api/client';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  access: string;
  refresh?: string;
  user?: {
    id: number | string;
    username?: string;
    email?: string;
  };
};

const storedToken = localStorage.getItem('accessToken');
const storedUser = localStorage.getItem('authUser');

const initialState: AuthState = {
  token: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  status: 'idle',
  error: null,
};

const buildUser = (payload: LoginPayload, apiUser?: LoginResponse['user']): User => {
  const username = apiUser?.username || payload.email.split('@')[0] || payload.email;
  return {
    id: String(apiUser?.id ?? payload.email),
    email: apiUser?.email || payload.email,
    name: username,
    role: 'analyst',
  };
};

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<LoginResponse>('/api/v1/auth/token/', payload);
      const { access, refresh, user } = response.data;

      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }
      localStorage.setItem('accessToken', access);

      const mappedUser = buildUser(payload, user);
      localStorage.setItem('authUser', JSON.stringify(mappedUser));

      return { token: access, user: mappedUser };
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.[0] ||
        'Login failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
