import { faker } from '@faker-js/faker';

describe('Burger Constructor Page - New Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'order-response.json' }).as('createOrder');

    cy.setCookie('accessToken', faker.string.uuid());
    localStorage.setItem('refreshToken', faker.string.uuid());

    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('should load ingredients and display them', () => {
    cy.wait('@getIngredients', { requestTimeout: 10000, responseTimeout: 10000 }).then((interception) => {
      if (interception.response) {
        console.log('Intercepted ingredients:', interception.response.body);
      } else {
        console.error('No response intercepted:', interception);
      }
    });

    cy.get('[data-cy="ingredients-section"]').should('exist');
    cy.get('[data-cy="ingredient-643d69a5c3f7b901cfa093c"]', { timeout: 20000 }).should('exist');
    cy.get('[data-cy="ingredient-643d69a5c3f7b901cfa093d"]', { timeout: 20000 }).should('exist');
  });

  it('should add a bun and an ingredient to constructor', () => {
    cy.wait('@getIngredients', { requestTimeout: 10000, responseTimeout: 10000 }).then((interception) => {
      if (interception.response) {
        console.log('Intercepted ingredients:', interception.response.body);
      } else {
        console.error('No response intercepted:', interception);
      }
    });

    cy.get('[data-cy="add-button-643d69a5c3f7b901cfa093c"]', { timeout: 20000 }).should('exist').click();
    cy.get('[data-cy="bun-top"]').should('contain.text', 'Флюоресцентная булка R2-D3'); 
    cy.get('[data-cy="bun-bottom"]').should('contain.text', 'Флюоресцентная булка R2-D3'); 

    cy.get('[data-cy="add-button-643d69a5c3f7b901cfa093d"]', { timeout: 20000 }).should('exist').click();
    cy.get('[data-cy="ingredient-643d69a5c3f7b901cfa093d"]').should('exist');
  });

  it('should open and close ingredient modal', () => {
    cy.wait('@getIngredients', { requestTimeout: 10000, responseTimeout: 10000 }).then((interception) => {
      if (interception.response) {
        console.log('Intercepted ingredients:', interception.response.body);
      } else {
        console.error('No response intercepted:', interception);
      }
    });

    cy.get('[data-cy="ingredient-link-643d69a5c3f7b901cfa093c"]', { timeout: 20000 }).should('exist').click({ force: true });
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-title"]').should('contain.text', 'Детали ингредиента');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('should create an order and reset constructor', () => {
    cy.wait('@getIngredients', { requestTimeout: 10000, responseTimeout: 10000 }).then((interception) => {
      if (interception.response) {
        console.log('Intercepted ingredients:', interception.response.body);
      } else {
        console.error('No response intercepted:', interception);
      }
    });
    cy.wait('@getUser', { requestTimeout: 10000, responseTimeout: 10000 });

    cy.get('[data-cy="add-button-643d69a5c3f7b901cfa093c"]', { timeout: 20000 }).should('exist').click();
    cy.get('[data-cy="add-button-643d69a5c3f7b901cfa093d"]', { timeout: 20000 }).should('exist').click();

    cy.get('[data-cy="order-button"]').should('exist').click();
    cy.wait('@createOrder', { requestTimeout: 10000, responseTimeout: 10000 });

    cy.get('[data-cy="order-modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain.text', '12345');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="order-modal"]').should('not.exist');

    cy.get('[data-cy="bun-top"]').should('not.exist');
    cy.get('[data-cy="ingredient-643d69a5c3f7b901cfa093d"]').should('not.exist');
  });
});
