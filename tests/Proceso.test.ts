import {describe, it, expect} from "vitest";
import {Proceso} from "../src/Proceso";

describe("Proceso",()=> {
    it("Crear proceso", ()=> {

        const proceso = new Proceso("P1",200,4);

        expect(proceso.pid).toBe("P1");

        expect(proceso.tamanoMemoria).toBe(200);
        expect(proceso.tiempoCpuTotal).toBe(4);
        expect(proceso.tiempoCpuRestante).toBe(4);
        expect(proceso.estado).toBe("Nuevo");
        expect(proceso.quantumConsumido).toBe(0);
        expect(proceso.tiempoBloqueoRestante).toBe(0);

    })

    it("debe consumir un tick de CPU", () => {

        const proceso =
            new Proceso("P1", 200, 4);

        proceso.consumirCpu();

        expect(proceso.tiempoCpuRestante)
            .toBe(3);

        expect(proceso.quantumConsumido)
            .toBe(1);
    });

});
