import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../rootReducer';

export interface OrderState {
  isLoading: boolean;
  order: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  isLoading: false,
  order: null,
  error: null
};

export const getOrderThunk = createAsyncThunk<
  { orders: TOrder[] },
  number,
  { rejectValue: string }
>('order/getByNumber', async (number, { rejectWithValue }) => {
  try {
    return await getOrderByNumberApi(number);
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrderThunk.fulfilled,
        (state, action: PayloadAction<{ orders: TOrder[] }>) => {
          state.isLoading = false;
          state.error = null;
          state.order = action.payload.orders[0] ?? null;
        }
      )
      .addCase(getOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Error loading order';
      });
  }
});

export default orderSlice.reducer;

export const getOrderSelector = (state: RootState) => state.order;
