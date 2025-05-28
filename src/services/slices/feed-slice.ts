import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../rootReducer';

export interface FeedState {
  isLoading: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
}

export const initialState: FeedState = {
  isLoading: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

export const getFeedThunk = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feed/getFeed', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

export const getOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('feed/getProfileFeed', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.orders = payload.orders;
        state.total = payload.total;
        state.totalToday = payload.totalToday;
      })
      .addCase(getFeedThunk.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.error = payload ?? error.message ?? 'Error loading feed';
      })
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.orders = payload;
      })
      .addCase(getOrdersThunk.rejected, (state, { payload, error }) => {
        state.isLoading = false;
        state.error =
          payload ?? error.message ?? 'Error loading profile orders';
      });
  }
});

export default feedSlice.reducer;

// Селекторы
export const getFeedSelector = (state: RootState) => state.feed;
export const getOrdersSelector = (state: RootState) => state.feed.orders;
