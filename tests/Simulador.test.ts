import { describe, it, expect } from "vitest";
import { Simulador } from "../src/Simulador";
import { Proceso } from "../src/Proceso";

describe("SimuladorSO", () => {

   
it("RF01 - Debe rechazar memoria inválida", () => {
        expect(
            () => new Simulador(0, 2)
        ).toThrow();
    });


    it("RF01 - Debe rechazar quantum inválido", () => {
        expect(
            () => new Simulador(1024, 0)
        ).toThrow();
    });

   
});