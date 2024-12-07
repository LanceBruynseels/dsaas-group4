// it('should display the logo and registration form', () => {
//     cy.visit('https://dsaas-group4-5dhkwhosn-lance-bruynseels-projects.vercel.app/registration')
//
//     cy.get('img[alt="Vlinder Logo"]').should('be.visible');
//
//     cy.contains('Registreer').should('be.visible');
//     cy.get('input[name="username"]').should('be.visible');
//     cy.get('input[name="password"]').should('be.visible');
//     cy.get('select[name="facility"]').should('be.visible');
//     cy.get('select[name="supervisor"]').should('be.visible');
//     cy.contains('Registreer').should('be.visible');
// });
//
//
// it('should allow filling out the form', () => {
//     cy.visit('https://dsaas-group4-5dhkwhosn-lance-bruynseels-projects.vercel.app/registration')
//     cy.contains('Registreer').click();
// });



describe('template spec', function () {
    it('passes', function () {
        cy.visit('http://localhost:3000');
        cy.contains('REGISTRATIE').click()
        // Should be on a new URL which
        cy.url().should('include', '/registration')

        // Get an input, type into it
        cy.get('#username')
            .type('cypress')
            .should('have.value', 'cypress')

        cy.get('#first_name')
            .type('cypress')
            .should('have.value', 'cypress')

        cy.get('#last_name')
            .type('test')
            .should('have.value', 'test')

        cy.get('#password')
            .type('123')
            .should('have.value', '123')

        cy.get('#facility').select(1)
        cy.get('#supervisor').select(1)

        cy.get('button[type="submit"]').click()
        cy.contains('Registreer').click()

        cy.url().should('include', '/sign-in')

    });
});