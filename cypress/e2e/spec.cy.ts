describe(' Page Test', () => {
  it('Fills out and submits the registration form', () => {
    cy.visit('http://localhost:3000/registration');
    cy.get('input').eq(0).type('TestUser');

    cy.get('input').eq(1).type('SecurePassword123');

    cy.get('select').eq(0).select('faciliteit Leuven');

    cy.get('select').eq(1).select('Jan');

    cy.contains('Registreer').click();
  });
})

describe('All Other Pages Test', () => {
  it('Fills out and submits the login form', () => {
    cy.visit('http://localhost:3000/');
    cy.wait(2000);
    cy.contains('LOGIN').click();
    cy.url().should('include', '/sign-in');
    cy.wait(1000);
    cy.get('input[name="username"]').type('pepemon');
    cy.get('input[name="password"]').type('123+');
    cy.wait(1000);
    cy.contains('Log in').then(($btn) => {
      cy.wrap($btn).click().then(() => {
        cy.url().should('include', '/home');
      });
    });

    cy.url().should('include','/home');
    cy.wait(1000);
    cy.contains('Berichten').click();
    cy.url().should('include','/messaging');
    cy.wait(4000);
    cy.contains('pepemon2').click();
    cy.wait(1000);
    cy.get('TextArea[placeholder="Type your message..."]').type('Yo from cypress');
    cy.wait(1000);
    cy.get('.bg-blue-500').click();
    cy.contains('Yo from cypress');
    cy.contains('Ontdek').click();
    cy.wait(1000);
    cy.url().should('include','/ontdek');
    cy.wait(5000);
    cy.get('input[placeholder="Search chats"]').type('Films');

    cy.contains('Search').click();
    cy.wait(6000);
    cy.get('button').contains('Films/Cinema').click();
    cy.url().should('include', '/group-messaging');
    cy.get('TextArea[placeholder="Type your message..."]').type('I like films: from cypress');

  });
});







