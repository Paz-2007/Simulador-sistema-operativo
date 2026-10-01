import { describe, it, expect } from "vitest";
import { BloqueMemoria } from "../src/BloqueMemoria";

describe("BloqueMemoria", () => {

    it("debe crear un bloque libre correctamente", () => {
        const bloque = new BloqueMemoria(0, 1024);

        expect(bloque.inicio).toBe(0);
        expect(bloque.tamano).toBe(1024);
        expect(bloque.libre).toBe(true);
        expect(bloque.pid).toBe(null);
    });

    it("Debe ocupar un bloque", () => {
        const bloque = new BloqueMemoria(0,200);
        bloque.ocupar("P1");

        expect(bloque.libre).toBe(false);
        expect(bloque.pid).toBe("P1");
    });

     it("Debe liberar un bloque", () => {
        const bloque = new BloqueMemoria(0, 200);

        bloque.ocupar("P1");
        bloque.liberar();

        expect(bloque.libre).toBe(true);
        expect(bloque.pid).toBeNull();
    });

    it("No debe permitir ocupar dos veces el mismo bloque", () => {
        const bloque = new BloqueMemoria(0, 200);

        bloque.ocupar("P1");

        expect(() => bloque.ocupar("P2")).toThrow();
    });



   
});