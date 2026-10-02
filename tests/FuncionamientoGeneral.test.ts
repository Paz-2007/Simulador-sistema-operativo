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

    it("Diagrama 2 - Ejecucion mediante Round Robin", () => {
        // Se verifica que al alcanzar el quantum, el primer proceso
        // // vuelva a Listo y el segundo proceso pase a Ejecutando
        const simulador = new Simulador(1000, 2);

        const p1 = new Proceso("P1", 200, 5);
        const p2 = new Proceso("P2", 200, 5);

        // Se registran ambos procesos
        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        // Primer tick: P1 comienza a ejecutar
        simulador.tick();

        expect(simulador.ejecutando).toBe(p1);
        expect(p1.quantumConsumido).toBe(1);

        // Segundo tick: P1 alcanza el quantum y se realiza
        // el cambio de contexto hacia P2
        simulador.tick();

        expect(p1.estado).toBe("Listo");
        expect(simulador.ejecutando).toBe(p2);

        // El quantum de P1 se reinicia al volver a la cola de Listos
        expect(p1.quantumConsumido).toBe(0);

        // Se verifica que se haya registrado el cambio de contexto
        expect(simulador.cambiosContexto).toBe(1);
    });



});