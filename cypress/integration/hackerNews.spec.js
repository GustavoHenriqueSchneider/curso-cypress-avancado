describe('Hacker News', () => {

    beforeEach(() => {

        cy.intercept('GET', `**/search?query=redux**`)
            .as('getInicialNews')

        cy.visit('https://hackernews-seven.vercel.app/')

        cy.wait('@getInicialNews')
    })

    it('verify initial term and news on search at the first visit', () => {

        cy.get('input')
            .should('have.value', 'redux')

        cy.get('.table-row')
            .should('have.length', 100)
    })

    it('show more 100 news after clicking on "More"', () => {

        cy.intercept('GET', '**/search**')
            .as('getMoreNews')

        cy.get('.interactions > button')
            .should('be.visible')
            .click()

        cy.wait('@getMoreNews')

        cy.get('.table-row')
            .should('have.length', 200)
    })

    it.only('verify last term news is storage on cache', () => {

        const faker = require('faker')

        const term = 'talking.io'

        let count = 0

        const word = faker.random.word()

        cy.intercept('GET', `**/search?query=${term}**`, req => {

            req.reply()
            count++
        }).as('getTermNews')

        cy.intercept('GET', `**/search?query=${word}**`).as('getRandomNews')

        Cypress._.times(5, () => {

            cy.get('input')
                .should('be.visible')
                .clear()
                .type(`${term}{enter}`)

            cy.wait('@getTermNews')
                .then(() => {

                    expect(count).to.equal(1)
                })

            cy.get('input')
                .should('be.visible')
                .clear()
                .type(`${word}{enter}`)

            cy.wait('@getRandomNews')
        })
    })
})