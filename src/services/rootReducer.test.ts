import rootReducer from './rootReducer';

describe('Root Reducer', () => {
  it('should return initial state for unknown action', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual({
      burgerConstructor: {
        isLoading: false,
        constructorItems: { bun: null, ingredients: [] },
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      feed: {
        isLoading: false,
        orders: [],
        total: 0,
        totalToday: 0,
        error: null
      },
      ingredients: {
        isLoading: false,
        ingredients: [],
        error: null
      },
      order: {
        isLoading: false,
        order: null,
        error: null
      },
      user: {
        isLoading: false,
        user: null,
        isAuthorized: false,
        isAuthChecked: false,
        error: null
      }
    });
  });
});
