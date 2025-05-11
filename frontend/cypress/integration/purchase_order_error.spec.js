/// <reference types="cypress" />

describe('Purchase Order Error Handling', () => {
  beforeEach(() => {
    // Login before each test (adjust this based on your authentication mechanism)
    cy.login();
    
    // Intercept API calls to suppliers to return mock data
    cy.intercept('GET', '/api/v1/suppliers', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Test Supplier 1' },
        { id: 2, name: 'Test Supplier 2' }
      ]
    }).as('getSuppliers');
  });

  it('should display error message when purchase order creation fails', () => {
    // Intercept the POST request to create a purchase order and return an error
    cy.intercept('POST', '/api/v1/purchases/orders', {
      statusCode: 500,
      body: {
        error: 'Failed to create purchase order',
        message: 'Database error'
      }
    }).as('createPurchaseOrder');

    // Visit the new purchase order page
    cy.visit('/purchases/orders/new');

    // Wait for suppliers to load
    cy.wait('@getSuppliers');

    // Fill out the form
    cy.get('[name="supplier_id"]').select('1'); // Select the first supplier
    cy.get('[name="order_date"]').type('2025-05-01');
    cy.get('[name="status"]').select('draft');

    // Add an item
    cy.contains('button', 'Add Item').click();
    cy.get('[name="item_description"]').type('Test Item');
    cy.get('[name="quantity"]').clear().type('2');
    cy.get('[name="unit_price"]').clear().type('100');
    cy.get('[name="tax_rate"]').clear().type('10');
    cy.contains('button', 'Save').click(); // Save the item

    // Submit the form
    cy.contains('button', 'Save').click(); // Save the purchase order

    // Wait for the API call
    cy.wait('@createPurchaseOrder');

    // Verify that the error message is displayed
    cy.contains('Failed to save purchase order. Please try again.').should('be.visible');
  });

  it('should display error message when purchase order update fails', () => {
    // Intercept the GET request to get a purchase order and return mock data
    cy.intercept('GET', '/api/v1/purchases/orders/1', {
      statusCode: 200,
      body: {
        id: 1,
        supplier_id: 1,
        order_date: '2025-05-01',
        order_number: 'PO-250501-1234',
        status: 'draft',
        payment_status: 'unpaid',
        subtotal: 200,
        tax_amount: 20,
        total_amount: 220,
        items: []
      }
    }).as('getPurchaseOrder');

    // Intercept the GET request to get purchase order items and return mock data
    cy.intercept('GET', '/api/v1/purchases/orders/1/items', {
      statusCode: 200,
      body: [
        {
          id: 1,
          purchase_order_id: 1,
          item_description: 'Existing Item',
          quantity: 2,
          unit_price: 100,
          subtotal: 200,
          tax_rate: 10
        }
      ]
    }).as('getPurchaseOrderItems');

    // Intercept the PUT request to update a purchase order and return an error
    cy.intercept('PUT', '/api/v1/purchases/orders/1', {
      statusCode: 500,
      body: {
        error: 'Failed to update purchase order',
        message: 'Database error'
      }
    }).as('updatePurchaseOrder');

    // Visit the edit purchase order page
    cy.visit('/purchases/orders/1/edit');

    // Wait for purchase order and items to load
    cy.wait('@getPurchaseOrder');
    cy.wait('@getPurchaseOrderItems');

    // Make a change to the purchase order
    cy.get('[name="status"]').select('approved');

    // Submit the form
    cy.contains('button', 'Save').click();

    // Wait for the API call
    cy.wait('@updatePurchaseOrder');

    // Verify that the error message is displayed
    cy.contains('Failed to save purchase order. Please try again.').should('be.visible');
  });

  // Helper function to login (adjust this based on your authentication mechanism)
  Cypress.Commands.add('login', () => {
    // This is a placeholder. Implement your login logic here.
    // For example:
    // cy.request({
    //   method: 'POST',
    //   url: '/api/v1/auth/login',
    //   body: {
    //     email: 'test@example.com',
    //     password: 'password'
    //   }
    // }).then((response) => {
    //   localStorage.setItem('token', response.body.token);
    // });
    
    // For now, we'll just set a dummy token
    localStorage.setItem('token', 'dummy-token');
  });
});
