// describe('My First Test', () => {
//   it('Does not do much!', () => {
//     expect(true).to.equal(true)
//   })
// })

// describe('My First Test', () => {
//   it('Does not do much!', () => {
//     expect(true).to.equal(false)
//   })
// })
//
// describe('My First Test', () => {
//   it('Visits the Kitchen Sink', () => {
//     cy.visit('https://example.cypress.io')
//   })
// })

// describe('My First Test', () => {
//   it('finds the content "type"', () => {
//     cy.visit('https://example.cypress.io')
//
//     cy.contains('type')
//   })
// })

// describe('My First Test', () => {
//   it('clicks the link "type"', () => {
//     cy.visit('https://example.cypress.io')
//
//     cy.contains('type').click()
//   })
// })

// describe('Cypress test', () => {
//   it('clicking database.new ', () => {
//     cy.visit('https://dsaas-group4.vercel.app/')
//
//     cy.contains('database.new').click()
//
//   })
// })

describe('Landing Page test', () => {
  it('Gets, types and asserts', () => {
    cy.visit('http://localhost:3000')

    cy.contains('registratie').click()


    cy.url().should('include', '/registration')

    cy.get('.Gebruikersnaam').type('')

    cy.get('.action-email').should('have.value', 'fake@email.com')
  })
})


