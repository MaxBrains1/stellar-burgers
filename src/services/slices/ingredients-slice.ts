import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { RootState } from '../rootReducer';

// state-тип
export interface IngredientsState {
  isLoading: boolean;
  ingredients: TIngredient[];
  error: string | null;
}

const initialState: IngredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

// thunk
export const getIngredientsThunk = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/get', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Unknown error');
  }
});

const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getIngredientsThunk.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.ingredients = action.payload;
        }
      )
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Error';
      });
  }
});

export default slice.reducer;
export const ingredientsSlice = slice;
export const getIngredientsStateSelector = (state: RootState) =>
  state.ingredients;
export const getIngredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;
