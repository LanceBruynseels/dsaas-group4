it('should display the logo and registration form', () => {
    cy.visit('https://dsaas-group4-5dhkwhosn-lance-bruynseels-projects.vercel.app/registration')

    cy.get('img[alt="Vlinder Logo"]').should('be.visible');

    cy.contains('Registreer').should('be.visible');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('select[name="facility"]').should('be.visible');
    cy.get('select[name="supervisor"]').should('be.visible');
    cy.contains('Registreer').should('be.visible');
});


it('should allow filling out the form', () => {
    cy.visit('https://dsaas-group4-5dhkwhosn-lance-bruynseels-projects.vercel.app/registration')
    cy.contains('Registreer').click();
});