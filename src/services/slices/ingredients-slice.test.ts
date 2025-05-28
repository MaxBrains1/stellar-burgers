import {
  ingredientsSlice,
  getIngredientsThunk,
  initialState
} from './ingredients-slice'; // Импортируем initialState
import { TIngredient } from '@utils-types';

describe('Ingredients Slice', () => {
  it('should handle getIngredientsThunk pending', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle getIngredientsThunk fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
        _id: 'bun1',
        name: 'Test Bun',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 300,
        price: 100,
        image: 'bun.jpg',
        image_mobile: 'bun_mobile.jpg',
        image_large: 'bun_large.jpg'
      }
    ];
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: ingredients
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(ingredients);
    expect(state.error).toBe(null);
  });

  it('should handle getIngredientsThunk rejected', () => {
    const action = {
      type: getIngredientsThunk.rejected.type,
      payload: 'Failed to fetch'
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });
});
