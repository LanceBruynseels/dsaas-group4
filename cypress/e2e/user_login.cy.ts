// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('https://localhost:3000')
//     // cy.visit('https://example.cypress.io')
//   })
// })


describe('template spec', function () {
  it('passes', function () {
    cy.visit('http://localhost:3000');
    cy.contains('LOGIN').click()
    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should('include', '/sign-in')

    // Get an input, type into it
    cy.get('#username')
        .type('lance')
        .should('have.value', 'lance')

    cy.get('#password')
        .type('lance')
        .should('have.value', 'lance')


    cy.get('button[type="submit"]').click()
    // cy.contains('Log in').click()
    //   .reload()
    cy.url().should('include', '/home')
    cy.reload()

  });
});





