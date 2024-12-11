
it('should allow filling out the form', () => {
    cy.visit('https://localhost:3000/')
    cy.contains('REGISTRATIE').click();
});


