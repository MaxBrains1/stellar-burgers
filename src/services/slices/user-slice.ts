import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { RootState } from '../rootReducer';

export interface UserState {
  isLoading: boolean;
  user: TUser | null;
  isAuthorized: boolean;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoading: false,
  user: null,
  isAuthorized: false,
  isAuthChecked: false,
  error: null
};

// --- Thunks с побочными эффектами внутри payload-creator-ов

export const loginUserThunk = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    // побочный эффект вынесен сюда:
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

export const registerUserThunk = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    // побочный эффект вынесен сюда:
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    // побочный эффект вынесен сюда:
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

// остальные thunks без изменений, т.к. не делают side-effects с куками или storage…

export const updateUserThunk = createAsyncThunk<
  { user: TUser },
  Partial<{ name: string; email: string; password: string }>,
  { rejectValue: string }
>('user/update', async (data, { rejectWithValue }) => {
  try {
    return await updateUserApi(data);
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    await forgotPasswordApi(data);
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

export const resetPasswordThunk = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (data, { rejectWithValue }) => {
  try {
    await resetPasswordApi(data);
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

export const getUserThunk = createAsyncThunk<
  { user: TUser },
  void,
  { rejectValue: string }
>('user/get', async (_, { rejectWithValue }) => {
  try {
    return await getUserApi();
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    checkUserStatus(state) {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthorized = true;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.error = payload ?? error.message ?? 'Error logging in';
      })

      // register
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthorized = true;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.error = payload ?? error.message ?? 'Error registering';
      })

      // logout
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthorized = false;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.error = payload ?? error.message ?? 'Error logging out';
      })

      // update
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.error = payload ?? error.message ?? 'Error updating profile';
      })

      // forgot password
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.error =
          payload ?? error.message ?? 'Error requesting password reset';
      })

      // reset password
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.error = payload ?? error.message ?? 'Error resetting password';
      })

      // get current user
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.isAuthorized = true;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = payload ?? error.message ?? 'Error fetching user';
      });
  }
});

export const { clearUserError, checkUserStatus } = userSlice.actions;
export { initialState as userInitialState };
export default userSlice.reducer;

// Селекторы
export const getUserStateSelector = (state: RootState) => state.user;
export const getUserSelector = (state: RootState) => state.user.user;
export const isAuthorizedSelector = (state: RootState) =>
  state.user.isAuthorized;
export const getUserErrorSelector = (state: RootState) => state.user.error;
export const isAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;
