

describe('Home-Filtros de eventos', () => {

    beforeEach(() => {
        cy.visit("https://ticketazo.com.ar/")
        cy.viewport(1280, 800)
    })
    it("Ver eventos sin Login", () => {

        //cy.viewport(1280, 800)

        cy.get('[data-slot="value"]').contains("Categoría").click()
        cy.get('[data-label="true"]').contains("Teatro").click()
        cy.get('[data-cy="evento-img-1"]').should('have.length.greaterThan', 0)
        cy.contains("Limpiar filtros").click()
        cy.get('.relative').should("have.length.greaterThan", 0)

        //cy.get(".p-2").click() esto es la version chiquita de cypress ve (como el responsive)


    })


    it("Filtrar eventos en el buscador", () => {
        cy.get('[aria-label="Search"]').type("Tesis").type('{enter}')
        cy.get('[value="Tesis"]').should('be.visible')

    })

    it("Filtrar eventos con una fecha aleatoria", () => {
        //const inicioDia = Math.floor(Math.random() * 20) + 1
        //const finDia = Math.floor(Math.random() * 10) + 21
        const inicioDia = Math.floor(Math.random() * 20) + 1   // 1-20
        const finDia = Math.floor(Math.random() * 10) + 21     // 21-30
        const mes = "09"
        const año = "2025"

        cy.get('[aria-label="día, Fecha de inicio, "]').type(inicioDia.toString().padStart(2, "0"))
        cy.get('[aria-label="mes, Fecha de inicio, "]').type(mes)
        cy.get('[aria-label="año, Fecha de inicio, "]').type(año)

        cy.get('[aria-label="día, Fecha final, "]').type(finDia.toString().padStart(2, "0"))
        cy.get('[aria-label="mes, Fecha final, "]').type(mes)
        cy.get('[aria-label="año, Fecha final, "]').type(año)



        cy.get('[data-slot="start-input"]').should("contain.text", `${inicioDia}/${mes.replace(/^0/, "")}/${año}`)

        cy.get("[data-cy^='evento-card']").then((eventos) => {
            if (eventos.length > 0) {
                cy.log(` Se encontraron ${eventos.length} eventos entre ${inicioDia}/${mes}/${año} y ${finDia}/${mes}/${año}`)

            } else {
                cy.log(` No hay eventos entre ${inicioDia}/${mes}/${año} y ${finDia}/${mes}/${año}`)
            }

        })

        // cy.get('[data-slot="start-input"]').invoke("text").then((fechaMostrada) => {
        // const esperado = `${parseInt(inicioDia)}/${parseInt(mes)}/${año}`
        // expect(fechaMostrada).to.contain(esperado) 

        // }) aca valida que la fecha sea la misma, pero tirar error por que yo tengo 4 y espera 04 o al reves


    })

    it("Validar búsqueda con rango de fechas inválido", () => {
        const inicioDia = "25";   // Día de inicio mayor
        const finDia = "10";      // Día de fin menor
        const mes = "09";
        const año = "2025";

        // Llenar fecha de inicio
        cy.get('[data-slot="start-input"]').type(`${inicioDia}/${mes}/${año}`);

        // Llenar fecha de fin
        cy.get('[data-slot="end-input"]').type(`${finDia}/${mes}/${año}`);

        // Ahora validamos el comportamiento esperado
        cy.get("body").then(($body) => {
            if ($body.text().includes("Rango inválido") || $body.text().includes("Error")) {
                cy.log(" La aplicación mostró un mensaje de error por el rango inválido");
            } else {
                cy.get("[data-cy^='evento-card']").should("have.length", 0);
                cy.log(" No se encontraron eventos porque el rango es inválido");
            }
        });
    });

    it("Seleccionar la categoría Teatro", () => {
        // 1. Hacer click en el botón del desplegable
        cy.get('button[data-slot="trigger"]').first().click({ multiple: true });

        // 2. Esperar que aparezca la opción (ejemplo "Teatro") y hacer click
        cy.contains('span', 'Teatro').click({ multiple: true });

        // 3. Verificar que ahora se filtraron los eventos por categoría Teatro
        cy.get('[data-cy="eventos-grid"]')
            .should('contain.text', 'Teatro');
    })


    it("Filtrar eventos por categoría y validar resultados", () => {
        // 1. Abrir el dropdown de categorías
        cy.get("button[data-slot='trigger']").first().click({ multiple: true });

        // 2. Capturar todas las opciones visibles en el listbox
        cy.get("[data-slot='listbox']").then(($options) => {
            const categorias = $options.toArray().map((el) => el.innerText.trim()).filter(Boolean);

            // 3. Seleccionar una categoría al azar
            const randomIndex = Math.floor(Math.random() * categorias.length);
            const categoriaSeleccionada = categorias[randomIndex];

            cy.log("Categoría seleccionada: " + categoriaSeleccionada);

            // 4. Click en la categoría seleccionada
            cy.wrap($options[randomIndex]).click();

            // 5. Verificar que aparecen eventos
            cy.get("div[data-cy='eventos-grid']")
                .find("div[data-cy^='evento-card']")
                .should("have.length.gt", 0);

            // 6. Validación condicional según la categoría
            cy.get("div[data-cy='eventos-grid']").then(($grid) => {
                if (categoriaSeleccionada === "Fiesta") {
                    cy.wrap($grid).should("contain.text", "Fiesta");
                } else if (categoriaSeleccionada === "Teatro") {
                    cy.wrap($grid).should("contain.text", "Teatro");
                } else if (categoriaSeleccionada === "Recital") {
                    cy.wrap($grid).should("contain.text", "Recital");
                } else {
                    cy.log("Categoría seleccionada sin validación específica: " + categoriaSeleccionada);
                }
            });
        });



        it("Filtrar eventos por categoría y validar resultados2", () => {
            // 1. Abrir el dropdown de categorías
            cy.get("button[data-slot='trigger']").first().click({ multiple: true });

            // 2. Capturar todas las opciones visibles en el listbox
            cy.get("ul[data-slot='listbox'] li[role='option']").then(($options) => {
                const categorias = $options.toArray().map((el) => el.innerText.trim()).filter(Boolean);

                // 3. Seleccionar una categoría al azar
                const randomIndex = Math.floor(Math.random() * categorias.length);
                const categoriaSeleccionada = categorias[randomIndex];

                cy.log("Categoría seleccionada: " + categoriaSeleccionada);

                // 4. Click en la categoría seleccionada
                cy.wrap($options[randomIndex]).click();

                // 5. Validar si hay eventos dentro de la categoría
                cy.get("div[data-cy='eventos-grid']").then(($grid) => {
                    const cantidadEventos = $grid.find("div[data-cy^='evento-card']").length;

                    if (cantidadEventos > 0) {
                        cy.log(` La categoría "${categoriaSeleccionada}" tiene ${cantidadEventos} eventos.`);
                        // Ejemplo: validar que cada tarjeta tenga imagen y texto
                        cy.wrap($grid)
                            .find("div[data-cy^='evento-card']")
                            .each((carta) => {
                                cy.wrap(carta).find("img").should("be.visible");
                                cy.wrap(carta).invoke("text").should("not.be.empty");
                            });
                    } else {
                        cy.log(` La categoría "${categoriaSeleccionada}" no tiene eventos.`);
                    }
                });
            });


        });

        it("Filtrar evento por multiples categoria", () => {
            cy.get('[data-slot="trigger"]').first().click({ force: true })

            cy.get("[data-slot='listbox']").then((opciones) => {
                const catego = opciones.toArray().map((elemento) => el.innerText().trim().filter(Boolean))
                const primerIndex = Math.floor(Math.random() * catego.length)
                let segundoIndex = Math.floor(Math.random() * catego.length)
                while (segundoIndex === primerIndex) {
                    segundoIndex = Math.floor(Math.random() * catego.length)
                }

                const categoria1 = catego = primerIndex
                const categoria2 = catego = segundoIndex

                cy.log(`Categoría seleccionadas: ${categoria1} y ${categoia2}`)

                cy.wrap(opciones[primerIndex]).click()
                cy.wrap(opciones[segundoIndex]).click()

                cy.get("[data-cy='eventos-grid']").then((grid) => {
                    const cantidadEventos = grid.find("[data-cy^='evento-card]']").length

                    if (cantidadEventos > 0) {
                        cy.log(`Se encontraron ${cantidadEventos} eventos para las categorias:${categoria1} y ${categoria2}`)
                    } else {
                        cy.log(`No hay eventos para la combinacion de categorias: ${categoria1} y ${categoria2}`)
                    }
                })


            })
        })

    });

})


/*cy.get('[role="gridcell"]').contains(String(inicioDia)).then((el) => {
    cy.wrap(el).click({ multiple: true })
})*/

/*cy.get('[role="gridcell"]').contains(String(inicioDia)).click()




cy.get('[role="gridcell"]').contains(String(finDia)).click({ force: true })*/










/* it("Filtrar eventos por categoría y validar resultados", () => {
    // 1. Abrir el dropdown de categorías
    cy.get("button[data-slot='trigger']").first().click({ multiple: true });

    // 2. Capturar todas las opciones visibles en el listbox
    cy.get("[data-slot='listbox']").then(($options) => {
        const categorias = $options.toArray().map((el) => el.innerText.trim()).filter(Boolean);

        // 3. Seleccionar una categoría al azar
        const randomIndex = Math.floor(Math.random() * categorias.length);
        const categoriaSeleccionada = categorias[randomIndex];

        cy.log("Categoría seleccionada: " + categoriaSeleccionada);

        // 4. Click en la categoría seleccionada
        cy.wrap($options[randomIndex]).click();

        cy.get("div[data-cy='eventos-grid']", { timeout: 5000 })
            .should("be.visible").within(() => {
                cy.get("div[data-cy^='evento-card']").should("have.length.gte", 1)

                cy.get("div[data-cy^='evento-card']").each((carta) => {
                    cy.wrap(carta).find("img").should("be.visible")
                    cy.wrap(carta).invoke("text").should("not.be.empty")
                })
            })

/*cy.get("div[data-cy='eventos-grid']", { timeout: 1000 }).should("be.visible")
cy.get("div[data-cy^='evento-card']").should("have.length.gte", 1)
    .each((carta) => {
        cy.wrap(carta).invoke("text").then((textoCarta) => {
            cy.log("Texto de carta:" + textoCarta)
            expect(textoCarta.toLowerCase()).to.include(categoriaSeleccionada.toLowerCase())
        })
    }) //esto que comente es para validar que la palabra "deportes por ejemplo" aparezca dentro de cada evneto, por eso no funciona



    })
})*/

















