// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Add a custom login command
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
