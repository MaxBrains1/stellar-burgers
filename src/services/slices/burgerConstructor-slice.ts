import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { RootState } from '../rootReducer';

export interface BurgerConstructorState {
  isLoading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: BurgerConstructorState = {
  isLoading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const sendOrderThunk = createAsyncThunk<
  { order: TOrder },
  string[],
  { rejectValue: string }
>('burgerConstructor/sendOrder', async (data, { rejectWithValue }) => {
  try {
    return await orderBurgerApi(data);
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      },
      reducer: (
        state,
        action: PayloadAction<TConstructorIngredient & { id: string }>
      ) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setNullOrderModalData: (state) => {
      state.orderModalData = null;
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      const items = state.constructorItems.ingredients;
      if (idx < items.length - 1) {
        [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
      }
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      const items = state.constructorItems.ingredients;
      if (idx > 0) {
        [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems = { bun: null, ingredients: [] };
      })
      .addCase(sendOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Error';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  setOrderRequest,
  setNullOrderModalData,
  moveIngredientDown,
  moveIngredientUp
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;

// Селектор состояния конструктора
export const getConstructorSelector = (state: RootState) =>
  state.burgerConstructor;
