const { expect } = require("chai")



describe('Home-Filtros de eventos', () => {

    beforeEach(() => {
        cy.visit("https://ticketazo.com.ar/")
        cy.viewport(1280, 800)
    })

    it("Filtrar evento por multiples categoria", () => {
        cy.get('[data-slot="trigger"]').first().click({ force: true })

        cy.get("[data-slot='listbox']").last().find("li").then((opciones) => {
            console.log(opciones.toArray())

            const categorias = [...opciones].map(li => li.innerText.trim());
            //const catego = opciones.find("li").toArray().map((elemento) => elemento.innerText.trim()).filter(Boolean)

            // const primerIndex = Math.floor(Math.random() * catego.length)
            // let segundoIndex = Math.floor(Math.random() * catego.length)
            // while (segundoIndex === primerIndex) { 
            //     segundoIndex = Math.floor(Math.random() * catego.length)
            // }

            let i1 = Math.floor(Math.random() * categorias.length)
            let i2;
            do {
                i2 = Math.floor(Math.random() * categorias.length); //esto se lee como, ejecuta esta linea y dsp corrobora el while
            } while (i2 === i1);

            // while (i2 ===i1) {  //los ciclos siempre se tienen que cumplir para que ejecute lo de adentro
            // i2 = Math.floor(Math.random() * categorias.length)
            // }

            const categoria1 = categorias[i1]
            const categoria2 = categorias[i2]


            // cy.log(`Categoría seleccionadas: ${categoria1} y ${categoria2}`)

            //cy.contains("[data-slot='listbox']:visible li", categoria1).click()
            //cy.contains("[data-slot='listbox']:visible li", categoria2).click()

            cy.wrap(opciones).contains(categoria1).click({ force: true })
            cy.wrap(opciones).contains(categoria2).click({ force: true })
            cy.get("[data-cy='eventos-grid']").should("be.visible")

            cy.get("[data-cy='eventos-grid']").then(($grid) => {

                const cantidadEventos = $grid.find("[data-cy^='evento-card']").length;

                if (cantidadEventos > 0) {
                    cy.log(` Se encontraron ${cantidadEventos} eventos para la combinación de categorías.`);

                    // Ejemplo: validar que el primer evento tenga título visible
                    cy.wrap($grid).find("[data-cy^='evento-card']").first().should("be.visible");
                } else {
                    cy.log(`No hay eventos para la combinación de categorías: ${categoria1} y ${categoria2}`);
                }


            })

            // cy.get("[data-cy='eventos-grid']").should("be.visible").then((grid) => {


            //     const cantidadEventos = grid.find("[data-cy^='evento-card']").length
            //     //cy.wait (5000)



            //     if (cantidadEventos > 0) {

            //         cy.log(`Se encontraron ${cantidadEventos} eventos para las categorias:${categoria1} y ${categoria2}`)
            //     } else {

            //         cy.log(`No hay eventos para la combinacion de categorias: ${categoria1} y ${categoria2}`)
            //     }

            //     console.log("llegamos al final")
            // })


        })
    })

    it.only("Validar datos en detalle del evento", () => {
        cy.get("[data-cy^='evento-card']").then((eventos) => {
            const totalEventos = eventos.length
            expect(totalEventos).to.be.gt(0)

            const randomIndex = Math.floor(Math.random() * totalEventos)
            const evento = eventos.eq(randomIndex)

            cy.wrap(evento).find("button").contains("Ver evento").click()

            cy.get("h1.text-3xl")
                .should("be.visible")
                .and(($el) => {
                    const texto = $el.text().trim()
                    expect(texto).not.to.be.empty
                })

            cy.get("span")
                .contains(/\d{4}/) // año con 4 dígitos
                .should("be.visible")

            cy.get("div span") // o un selector más específico
                .should("be.visible")
                .invoke("text")
                .then((texto) => {
                    expect(texto.trim()).to.not.be.empty;
                    cy.log("📌 Tipo de evento:", texto);
                });

            cy.contains("button", "Adquirir entrada")
                .should("be.visible")

            // cy.get("[data-cy='evento-horario']").should("be.visible").and((elemento) => {
            //     const texto = elemento.text().trim()
            //     expect(texto).to.match((/\d{1,2}:\d{2}/))
            // })

            //cy.get("[type='button']").contains("Adquirir entrada").should("be.visible")



        })


    })
})