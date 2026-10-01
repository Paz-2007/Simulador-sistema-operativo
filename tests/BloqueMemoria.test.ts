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

   
});