import { describe, it, expect } from "vitest";
import { Simulador } from "../src/Simulador";
import { Proceso } from "../src/Proceso";

describe("SimuladorSO", () => {

   
it("RF01 - Debe rechazar memoria inválida", () => {
        expect(() => new Simulador(0, 2)
        ).toThrow();
    });


    it("RF01 - Debe rechazar quantum inválido", () => {
        expect(() => new Simulador(1024, 0)
    ).toThrow();
    });


    it("RF02 - Debe registrar un proceso", () => {
        const simulador =new Simulador(1024, 2);

        const proceso =new Proceso("P1", 200, 4);

        simulador.registrarProceso(proceso);

        expect(simulador.esperandoMemoria.length).toBe(1);

        expect(proceso.estado).toBe("Esperando Memoria");
    });


     it("RF02 - No debe aceptar PID duplicado", () => {
        const simulador = new Simulador(1024, 2);

        const p1 =new Proceso("P1", 200, 4);

        const p2 =new Proceso("P1", 100, 2);

        simulador.registrarProceso(p1);

        expect(() => simulador.registrarProceso(p2)
        ).toThrow();
    });


    it("RF02 - No debe aceptar un proceso mayor que la memoria", () => {
        const simulador = new Simulador(500, 2);

        const proceso = new Proceso("P1", 600, 4);

        expect(() => simulador.registrarProceso(proceso)
        ).toThrow();
    });

      it("RF03 - Debe pasar un proceso a Listo cuando obtiene memoria", () => {
        const simulador = new Simulador(1024, 2);

        const proceso =new Proceso("P1", 200, 4);

        simulador.registrarProceso(proceso);

        simulador.tick();

        expect(proceso.estado).toBe("Ejecutando");
    });

     it("RF03 - Debe dejar esperando a un proceso sin memoria suficiente", () => {
        const simulador = new Simulador(500, 2);

        const p1 =new Proceso("P1", 400, 4);

        const p2 =new Proceso("P2", 200, 4);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        simulador.tick();

        expect(p2.estado).toBe("Esperando Memoria");
    });


    it("RF04 - Debe asignar memoria contigua", () => {
        const simulador =new Simulador(1000, 2);

        const p1 = new Proceso("P1", 300, 4);

        simulador.registrarProceso(p1);
        simulador.tick();

        const bloques = simulador.bloquesMemoria;

        expect(bloques[0].inicio).toBe(0);
        expect(bloques[0].tamano).toBe(300);
        expect(bloques[0].pid).toBe("P1");

        expect(bloques[1].inicio).toBe(300);
        expect(bloques[1].tamano).toBe(700);
    });








   
});