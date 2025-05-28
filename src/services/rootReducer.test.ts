import { initialState as burgerConstructorInitialState } from './slices/burgerConstructor-slice';
import { initialState as feedInitialState } from './slices/feed-slice';
import { initialState as ingredientsInitialState } from './slices/ingredients-slice';
import { initialState as orderInitialState } from './slices/order-slice';
import { initialState as userInitialState } from './slices/user-slice';
import rootReducer from './rootReducer';

describe('Root Reducer', () => {
  it('should return initial state for unknown action', () => {
    // Собираем начальное состояние из импортированных initialState
    const expectedInitialState = {
      burgerConstructor: burgerConstructorInitialState,
      feed: feedInitialState,
      ingredients: ingredientsInitialState,
      order: orderInitialState,
      user: userInitialState
    };

    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(expectedInitialState);
  });
});
