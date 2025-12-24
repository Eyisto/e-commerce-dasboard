import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, AsyncStatus } from '@/shared/types';
import { USE_MOCK } from '@/shared/api/client';

const initialState: AuthState = {
  token: localStorage.getItem('auth_token'),
  user: localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null,
  status: 'idle',
  error: null,
};

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (USE_MOCK) {
        // Mock login - accept any credentials
        const user: User = {
          id: 'user_001',
          email,
          name: email.split('@')[0],
          role: 'admin',
        };
        const token = 'mock_token_' + Date.now();
        
        return { user, token };
      }
      
      // Real API call would go here
      throw new Error('API not implemented');
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('auth_token', action.payload);
      } else {
        localStorage.removeItem('auth_token');
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('auth_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('auth_user');
      }
    },
    clearError: (state) => {
      state.error = null;
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
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
      });
  },
});

export const { setToken, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
