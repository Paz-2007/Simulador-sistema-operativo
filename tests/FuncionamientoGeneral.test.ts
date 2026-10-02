import { describe, it, expect } from "vitest";
import { Simulador } from "../src/Simulador";
import { Proceso } from "../src/Proceso";
import {AdministradorMemoria} from "../src/AdministradorMemoria";
import { BloqueMemoria } from "../src/BloqueMemoria";


describe ("Prueba general", () => {
    it("Debe ejecutar un escenario completo del simulador", () => {
    const simulador = new Simulador(1000, 2);

    const p1 = new Proceso("P1", 200, 3);
    const p2 = new Proceso("P2", 300, 4);
    const p3 = new Proceso("P3", 150, 2);

    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);
    simulador.registrarProceso(p3);

    simulador.configurarES("P2", 2, 2);

    // Tick 1: P1 comienza a ejecutar.
    simulador.tick();

    expect(p1.estado).toBe("Ejecutando");
    expect(p2.estado).toBe("Listo");
    expect(p3.estado).toBe("Listo");
    expect(simulador.memoriaOcupada()).toBe(650);

    // Tick 2: P1 alcanza el quantum y P2 pasa a ejecutar.
    simulador.tick();

    expect(p1.estado).toBe("Listo");
    expect(p2.estado).toBe("Ejecutando");

    // Tick 3: P2 consume su primer tick de CPU.
    simulador.tick();

    expect(p2.estado).toBe("Ejecutando");

    // Tick 4: P2 consume su segundo tick y se bloquea por E/S.
    simulador.tick();

    expect(p2.estado).toBe("Bloqueado");
    expect(simulador.bloqueados).toContain(p2);

    // Se ejecutan ticks adicionales para completar el escenario.
    for (let i = 0; i < 10; i++) {simulador.tick();
    }

    expect(simulador.terminados).toHaveLength(3);
    expect(simulador.memoriaOcupada()).toBe(0);
    expect(simulador.memoriaLibre()).toBe(1000);
    expect(simulador.ejecutando).toBeNull();
});

})

describe("Diagramas de secuencia", () => {

    it("Diagrama 1 - Registro y asignación de memoria", () => {
        //se verifica que el proceso cambie de estado 
        // a ejecitando y qe se le asigne u bloque de memoria
        const simulador = new Simulador(1000, 2);
        const proceso = new Proceso("P1", 200, 4);

        simulador.registrarProceso(proceso);
        //se registra el proceso

        expect(proceso.estado).toBe("Esperando Memoria");
        //al registrarlo queda esperando que se le asigne memoria

        simulador.tick();
        //el tick intenta admitir el proceso y asignarle memoria

        expect(proceso.estado).toBe("Ejecutando");
        //al tener memoria disponible el proceso pasa a ejecutar

        expect(simulador.memoriaOcupada()).toBe(200);
        expect(simulador.memoriaLibre()).toBe(800);
        //se verifica qye los 200kb hayan sido asignados
    });


it("Diagrama 3 - Bloqueo por E/S y finalización", () => {
    const simulador = new Simulador(1000, 3);
    const proceso = new Proceso("P1", 200, 5);

    simulador.registrarProceso(proceso);

    // después de consumir 2 ticks de CPU,
    // el proceso se bloquea durante 2 ticks.
    simulador.configurarES("P1", 2, 2);

    // Tick 1: el proceso comienza a ejecutar
    // Consume 1 tick de CPU
    simulador.tick();
    expect(proceso.estado).toBe("Ejecutando");

    // Tick 2: consume su segundo tick de CPU
    // y se bloquea por E/S
    simulador.tick();
    expect(proceso.estado).toBe("Bloqueado");

    // Tick 3: continúa bloqueado.
    simulador.tick();
    expect(proceso.estado).toBe("Bloqueado");

    // Tick 4: finaliza la E/S, vuelve a Listo,
    // es despachado y consume su tercer tick de CPU
    simulador.tick();
    expect(proceso.estado).toBe("Ejecutando");

    // Tick 5: consume su cuarto tick de CPU
    // Todavía le queda 1 tick
    simulador.tick();
    expect(proceso.estado).toBe("Ejecutando");

    // Tick 6: consume su último tick de CPU
    // y pasa a Terminado
    simulador.tick();
    expect(proceso.estado).toBe("Terminado");

    // Se verifica que el proceso haya sido agregado
    // a la lista de procesos terminados
    expect(simulador.terminados).toContain(proceso);

    // Al terminar, se libera la memoria que ocupaba
    expect(simulador.memoriaOcupada()).toBe(0);
});




});