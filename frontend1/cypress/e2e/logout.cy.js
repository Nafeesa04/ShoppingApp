/// <reference types="cypress" />

describe('Logout functionality', () => {
    beforeEach(() => {
      // Mock the localStorage token before visiting the app
      localStorage.setItem('token', 'mockToken123');
      
      // Visit the app
      cy.visit('http://localhost:3000/');
    });
  
    it('should display the Logout button when a user is logged in', () => {
      // Check if the Logout button is visible
      cy.get('.logout').should('be.visible');
    });
  
    it('should clear localStorage and redirect to the home page on logout', () => {
      // Spy on the window alert
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alert');
      });
  
      // Trigger logout by clicking the button
      cy.get('.logout').click();
  
      // Check that localStorage has been cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
  
      // Verify that the alert is displayed with the correct message
      cy.get('@alert').should('have.been.calledWith', 'You have logged out successfully.');
  
      // Wait for navigation to complete (optional delay)
      cy.wait(500); // Optional wait, you can adjust or remove
  
      // Ensure the user is redirected to the home page
      cy.url().should('eq', 'http://localhost:3000/');
    });
  });
  
  