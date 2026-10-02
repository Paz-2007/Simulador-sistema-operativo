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



   
});