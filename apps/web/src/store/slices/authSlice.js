import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, userApi } from 'api/auth';

export const initialState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  token: null,
  user: null,
};

export const signIn = createAsyncThunk('auth/signIn', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.login(data);
    return { token: response.accessToken, user: response.user };
  } catch (err) {
    const msg = err.response?.data?.message ?? err.message ?? 'Login failed';
    return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
  }
});

export const signUp = createAsyncThunk('auth/signUp', async (data, { rejectWithValue }) => {
  try {
    const response = await authApi.register(data);
    return { token: response.accessToken, user: response.user };
  } catch (err) {
    const msg = err.response?.data?.message ?? err.message ?? 'Registration failed';
    return rejectWithValue(Array.isArray(msg) ? msg.join(', ') : msg);
  }
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  try {
    await authApi.logout();
  } catch {
    // ignore logout errors
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await userApi.getMe();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Failed to load profile');
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticated: (state, action) => {
      state.loading = false;
      state.redirect = '/';
      state.token = action.payload.token;
      state.user = action.payload.user ?? null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    showAuthMessage: (state, action) => {
      state.message = action.payload;
      state.showMessage = true;
      state.loading = false;
    },
    hideAuthMessage: (state) => {
      state.message = '';
      state.showMessage = false;
    },
    signOutSuccess: (state) => {
      state.loading = false;
      state.token = null;
      state.user = null;
      state.redirect = '/';
    },
    showLoading: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.redirect = '/';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.redirect = '/app/onboarding';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.redirect = '/';
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.redirect = '/';
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const {
  authenticated,
  setToken,
  showAuthMessage,
  hideAuthMessage,
  signOutSuccess,
  showLoading,
  signInSuccess,
} = authSlice.actions;

export default authSlice.reducer;
