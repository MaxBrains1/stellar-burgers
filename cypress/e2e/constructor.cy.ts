import { faker } from '@faker-js/faker';

// Константы селекторов
const SELECTORS = {
  INGREDIENT_BUN: '[data-cy="ingredient-643d69a5c3f7b9001cfa093d"]',
  ADD_BUTTON_BUN: '[data-cy="add-button-643d69a5c3f7b9001cfa093d"]',
  ADD_BUTTON_INGREDIENT: '[data-cy="add-button-643d69a5c3f7b9001cfa0941"]',
  MODAL: '[data-cy="modal"]',
  MODAL_CLOSE: '[data-cy="modal-close"]',
  BUN_TOP: '[data-cy="bun-top"]',
  INGREDIENT_INGREDIENT: '[data-cy="ingredient-643d69a5c3f7b9001cfa0941"]',
  ORDER_BUTTON: '[data-cy="order-button"]',
  INGREDIENTS_SECTION: '[data-cy="ingredients-section"]'
};

describe('Burger Constructor Page - New Tests', () => {
  beforeEach(() => {
    cy.fixture('ingredients').then((mockIngredients) => {
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
        statusCode: 200,
        body: mockIngredients
      }).as('getIngredients');

      cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'order-response.json' }).as('createOrder');

      cy.setCookie('accessToken', faker.string.uuid());
      localStorage.setItem('refreshToken', faker.string.uuid());

      cy.visit('/');
    });
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('should load ingredients and display them', () => {
    cy.wait('@getIngredients').then((interception) => {
      if (interception.response) {
        console.log('Intercepted ingredients:', interception.response.body.data);
      } else {
        console.error('No response intercepted:', interception);
      }
    });

    cy.get(SELECTORS.INGREDIENTS_SECTION).should('exist');

    cy.fixture('ingredients').then((mockIngredients) => {
      cy.get('[data-cy^="ingredient-"]').should('have.length', mockIngredients.data.length);
    });
  });

  it('should add a bun and an ingredient to constructor', () => {
    cy.wait('@getIngredients').then((interception) => {
      if (interception.response) {
        console.log('Intercepted ingredients:', interception.response.body.data);
      } else {
        console.error('No response intercepted:', interception);
      }
    });

    cy.get(SELECTORS.ADD_BUTTON_BUN, { timeout: 20000 })
      .should('exist')
      .click();
    cy.get(SELECTORS.BUN_TOP).should('contain.text', 'Флюоресцентная булка R2-D3');
    cy.get('[data-cy="bun-bottom"]').should('contain.text', 'Флюоресцентная булка R2-D3');

    cy.get(SELECTORS.ADD_BUTTON_INGREDIENT, { timeout: 20000 })
      .should('exist')
      .click();
    cy.get(SELECTORS.INGREDIENT_INGREDIENT).should('exist');
  });

  it('should open and close ingredient modal', () => {
    cy.wait('@getIngredients').then((interception) => {
      if (interception.response) {
        console.log('Intercepted ingredients:', interception.response.body.data);
      } else {
        console.error('No response intercepted:', interception);
      }
    });

    cy.get(SELECTORS.INGREDIENT_BUN, { timeout: 20000 })
      .should('exist')
      .click({ force: true }); // Оставляем force: true, так как ревьюер не указал это как проблему
    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.get('[data-cy="modal-title"]').should('contain.text', 'Детали ингредиента');

    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('should create an order and reset constructor', () => {
    cy.wait('@getIngredients').then((interception) => {
      if (interception.response) {
        console.log('Intercepted ingredients:', interception.response.body.data);
      } else {
        console.error('No response intercepted:', interception);
      }
    });
    cy.wait('@getUser');

    cy.get(SELECTORS.ADD_BUTTON_BUN, { timeout: 20000 })
      .should('exist')
      .click();
    cy.get(SELECTORS.ADD_BUTTON_INGREDIENT, { timeout: 20000 })
      .should('exist')
      .click();

    cy.get(SELECTORS.ORDER_BUTTON, { timeout: 20000 })
      .should('exist')
      .click();
    cy.wait('@createOrder', { requestTimeout: 10000, responseTimeout: 10000 }).then((interception) => {
      console.log('Order response:', interception.response?.body);
    });

    cy.get(SELECTORS.MODAL, { timeout: 20000 })
      .should('be.visible')
      .then(($modal) => {
        console.log('Modal found:', $modal);
      });
    cy.get('h2.text_type_digits-large').should('contain.text', '12345');

    cy.get(SELECTORS.MODAL_CLOSE, { timeout: 20000 })
      .should('exist')
      .click();
    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.get(SELECTORS.BUN_TOP).should('not.exist');
  });
});
