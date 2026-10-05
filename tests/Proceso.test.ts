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

    it("debe consumir un tick de CPU y resta quantum", () => {

        const proceso = new Proceso("P1", 200, 4);

        proceso.consumirCpu();

        expect(proceso.tiempoCpuRestante).toBe(3);

        expect(proceso.quantumConsumido).toBe(1);
            //si el proceso consume un tick se le resta 
            // 1 al tiempo restante y se le suma 1 al 
            // quantum consumido
    });


       it("Proceso cambia de estado", () => {
        //que funcione bien el metodo cambiar estado

        const proceso = new Proceso("P1", 200, 4);

        proceso.cambiarEstado("Listo");

        expect(proceso.estado) .toBe("Listo");
        
    });


        it("El proceso se bloquea", () => {

        const proceso = new Proceso("P1", 200, 4);

        proceso.bloquear(3);
        proceso.actualizarBloqueo();
        expect(proceso.tiempoBloqueoRestante).toBe(2);
        // si el tiempo de bloqueo es mayor a 0 se le resta 1

    });

    it("Debe rechazar CPU invalida", () =>{
        expect(() => new Proceso("P1", 200, 0)).toThrow();
        // si el tiempo de cpu es 0 o el numero no es entero se lanza error
    }); 
});
