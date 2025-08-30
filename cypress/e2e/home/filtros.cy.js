

describe('Home-Filtros de eventos', () => {

    beforeEach (() =>{
        cy.visit("https://ticketazo.com.ar/")
        cy.viewport(1280, 800)
    })
    it("Ver eventos sin Login", () => {

        //cy.viewport(1280, 800)
        
        cy.get('[data-slot="value"]').contains("Categoría").click()
        cy.get('[data-label="true"]').contains("Teatro").click()
        cy.get('[data-cy="evento-img-1"]').should('have.length.greaterThan', 0 )
        cy.contains("Limpiar filtros").click()
        cy.get('.relative').should("have.length.greaterThan", 0)
        
        //cy.get(".p-2").click() esto es la version chiquita de cypress ve (como el responsive)


    })


    it("Filtrar eventos en el buscador", () =>{
        cy.get('[aria-label="Search"]').type("Tesis").type('{enter}')
         cy.get('[value="Tesis"]').should('be.visible')
        
    })

    



})