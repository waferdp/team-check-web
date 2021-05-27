describe('Open team selector', () => {
    it('Visits the team-selector!', () => {
        cy.visit('#/team-selector');
    })
});

describe('Select a team', () => {
    it('Opens the team selector and selects a team', () => {
        cy.intercept('GET', '*api/teams', { fixture: 'teams.json' }).as('getTeams');
        cy.visit('#/team-selector');
        cy.get('#select-team').select('Carbuncles');
    })
});

describe('Add a team', () => {
    it('Opens the team selector and adds a team', () => {
        cy.intercept('GET', '*api/teams', { fixture: 'teams.json' }).as('getTeams');
        cy.intercept('POST', '*api/teams', (req) => {
            expectedJson = JSON.stringify(JSON.parse('{"name": "doorags"}'));
            expect(JSON.stringify(req.body)).to.include(expectedJson);
        });

        cy.visit('#/team-selector');
        cy.get('#select-team').select('Create new team');
        
        
        cy.get('#new-team-name').type('doorags');
        cy.get('#add-team').click();
    })
});
