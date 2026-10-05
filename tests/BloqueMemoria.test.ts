import { describe, it, expect } from "vitest";
import { BloqueMemoria } from "../src/BloqueMemoria";

describe("BloqueMemoria", () => {

    it("debe crear un bloque libre correctamente", () => {
        const bloque = new BloqueMemoria(0, 1024);

        expect(bloque.inicio).toBe(0); //el inicio va a ser posicion 0
        expect(bloque.tamano).toBe(1024); //va a tener el tamano que ingresamos
        expect(bloque.libre).toBe(true); //va a estar libre
        expect(bloque.pid).toBe(null); //no va a tener pid
    });

    it("Debe ocupar un bloque", () => {
        const bloque = new BloqueMemoria(0,200);
        bloque.ocupar("P1");

        // El bloque debe estar ocupado y tener pid de P1
        expect(bloque.libre).toBe(false);
        expect(bloque.pid).toBe("P1");
    });

     it("Debe liberar un bloque", () => {
        const bloque = new BloqueMemoria(0, 200);

        bloque.ocupar("P1");
        bloque.liberar();

        //se verifica si se libero viendo si su pid es nulo y si libre devuelve true
        expect(bloque.libre).toBe(true);
        expect(bloque.pid).toBeNull();
    });

    it("No debe permitir ocupar dos veces el mismo bloque", () => {
        const bloque = new BloqueMemoria(0, 200);

        bloque.ocupar("P1");

        // [Libre 400] [P3 200] [Libre 400]

        // Hay 800 KB libres en total y el mayor bloque libre es de 400 KB
    
        // Fragmentacion (1 - 400 / 800) * 100 = 50%
        expect(() => bloque.ocupar("P2")).toThrow();
    });



   
});