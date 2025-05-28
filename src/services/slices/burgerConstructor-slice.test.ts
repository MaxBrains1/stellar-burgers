import {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from './burgerConstructor-slice';
import { burgerConstructorSlice } from './burgerConstructor-slice'; // Импортируем слайс
import { TConstructorIngredient, TIngredient } from '@utils-types';

describe('Burger Constructor Slice', () => {
  const initialState = {
    isLoading: false,
    constructorItems: { bun: null, ingredients: [] },
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  it('should add a bun', () => {
    const bun: TIngredient = {
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
    };
    const action = addIngredient(bun);
    const state = burgerConstructorSlice.reducer(initialState, action); // Используем reducer
    expect(state.constructorItems.bun).toEqual({
      ...bun,
      id: expect.any(String)
    });
  });

  it('should add an ingredient', () => {
    const ingredient: TIngredient = {
      _id: 'main1',
      name: 'Test Main',
      type: 'main',
      proteins: 15,
      fat: 25,
      carbohydrates: 35,
      calories: 400,
      price: 150,
      image: 'main.jpg',
      image_mobile: 'main_mobile.jpg',
      image_large: 'main_large.jpg'
    };
    const action = addIngredient(ingredient);
    const state = burgerConstructorSlice.reducer(initialState, action);
    expect(state.constructorItems.ingredients).toContainEqual({
      ...ingredient,
      id: expect.any(String)
    });
  });

  it('should remove an ingredient', () => {
    const ingredient: TConstructorIngredient = {
      _id: 'main1',
      name: 'Test Main',
      type: 'main',
      proteins: 15,
      fat: 25,
      carbohydrates: 35,
      calories: 400,
      price: 150,
      image: 'main.jpg',
      image_mobile: 'main_mobile.jpg',
      image_large: 'main_large.jpg',
      id: '456'
    };
    const stateWithIngredient = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredient]
      }
    };
    const action = removeIngredient('456');
    const state = burgerConstructorSlice.reducer(stateWithIngredient, action);
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('should move ingredient up', () => {
    const ingredients: TConstructorIngredient[] = [
      {
        _id: 'main1',
        name: 'Test Main 1',
        type: 'main',
        proteins: 15,
        fat: 25,
        carbohydrates: 35,
        calories: 400,
        price: 150,
        image: 'main1.jpg',
        image_mobile: 'main1_mobile.jpg',
        image_large: 'main1_large.jpg',
        id: '1'
      },
      {
        _id: 'main2',
        name: 'Test Main 2',
        type: 'main',
        proteins: 15,
        fat: 25,
        carbohydrates: 35,
        calories: 400,
        price: 150,
        image: 'main2.jpg',
        image_mobile: 'main2_mobile.jpg',
        image_large: 'main2_large.jpg',
        id: '2'
      }
    ];
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients
      }
    };
    const action = moveIngredientUp(1);
    const state = burgerConstructorSlice.reducer(stateWithIngredients, action);
    expect(state.constructorItems.ingredients[0].id).toBe('2');
    expect(state.constructorItems.ingredients[1].id).toBe('1');
  });

  it('should move ingredient down', () => {
    const ingredients: TConstructorIngredient[] = [
      {
        _id: 'main1',
        name: 'Test Main 1',
        type: 'main',
        proteins: 15,
        fat: 25,
        carbohydrates: 35,
        calories: 400,
        price: 150,
        image: 'main1.jpg',
        image_mobile: 'main1_mobile.jpg',
        image_large: 'main1_large.jpg',
        id: '1'
      },
      {
        _id: 'main2',
        name: 'Test Main 2',
        type: 'main',
        proteins: 15,
        fat: 25,
        carbohydrates: 35,
        calories: 400,
        price: 150,
        image: 'main2.jpg',
        image_mobile: 'main2_mobile.jpg',
        image_large: 'main2_large.jpg',
        id: '2'
      }
    ];
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients
      }
    };
    const action = moveIngredientDown(0);
    const state = burgerConstructorSlice.reducer(stateWithIngredients, action);
    expect(state.constructorItems.ingredients[0].id).toBe('2');
    expect(state.constructorItems.ingredients[1].id).toBe('1');
  });
});
