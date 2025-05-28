import { faker } from '@faker-js/faker';

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

    cy.get('[data-cy="ingredients-section"]').should('exist');

    cy.fixture('ingredients').then((mockIngredients) => {
      cy.get('[data-cy^="ingredient-"]') 
        .should('have.length', mockIngredients.data.length);
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

    cy.get('[data-cy="add-button-643d69a5c3f7b9001cfa093d"]', { timeout: 20000 }) 
      .should('exist')
      .click();
    cy.get('[data-cy="bun-top"]').should('contain.text', 'Флюоресцентная булка R2-D3');
    cy.get('[data-cy="bun-bottom"]').should('contain.text', 'Флюоресцентная булка R2-D3');

    cy.get('[data-cy="add-button-643d69a5c3f7b9001cfa0941"]', { timeout: 20000 }) 
      .should('exist')
      .click();
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"]').should('exist');
  });

  it('should open and close ingredient modal', () => {
    cy.wait('@getIngredients').then((interception) => {
      if (interception.response) {
        console.log('Intercepted ingredients:', interception.response.body.data);
      } else {
        console.error('No response intercepted:', interception);
      }
    });


    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093d"]', { timeout: 20000 })
      .should('exist')
      .click({ force: true });
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-title"]').should('contain.text', 'Детали ингредиента');


    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
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


    cy.get('[data-cy="add-button-643d69a5c3f7b9001cfa093d"]', { timeout: 20000 })
      .should('exist')
      .click();
    cy.get('[data-cy="add-button-643d69a5c3f7b9001cfa0941"]', { timeout: 20000 })
      .should('exist')
      .click();


    cy.get('[data-cy="order-button"]', { timeout: 20000 })
      .should('exist')
      .click();
    cy.wait('@createOrder', { requestTimeout: 10000, responseTimeout: 10000 }).then((interception) => {
      console.log('Order response:', interception.response?.body);
    });

    cy.get('[data-cy="modal"]', { timeout: 20000 })
      .should('be.visible')
      .then(($modal) => {
        console.log('Modal found:', $modal);
      });
    cy.get('h2.text_type_digits-large').should('contain.text', '12345'); 

    cy.get('[data-cy="modal-close"]', { timeout: 20000 })
      .should('exist')
      .click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="bun-top"]').should('not.exist');
  });
});
