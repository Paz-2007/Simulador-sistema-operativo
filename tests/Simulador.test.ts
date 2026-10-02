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

     it("RF05 - Debe liberar memoria al terminar un proceso", () => {
        const simulador = new Simulador(500, 2);
        const proceso = new Proceso("P1", 200, 1);

        simulador.registrarProceso(proceso);
        simulador.tick();

        expect(proceso.estado).toBe("Terminado");
        expect(simulador.memoriaLibre()).toBe(500);
    });

      it("RF06 - Debe avanzar un tick por llamada", () => {
        const simulador = new Simulador(500, 2);

        expect(simulador.tickActual).toBe(0);

        simulador.tick();

        expect(simulador.tickActual).toBe(1);

        simulador.tick();

        expect(simulador.tickActual).toBe(2);
    });


    it("RF07 - Debe ejecutar procesos con Round Robin", () => {
        const simulador =new Simulador(1000, 2);
        const p1 =new Proceso("P1", 200, 4);
        const p2 =new Proceso("P2", 200, 4);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        simulador.tick();

        expect(simulador.ejecutando).toBe(p1);

        simulador.tick();

        expect(simulador.ejecutando).toBe(p2);
    });

    it("RF07 - Debe respetar el quantum", () => {
        const simulador = new Simulador(1000, 2);
        const p1 = new Proceso("P1", 200, 5);
        const p2 = new Proceso("P2", 200, 5);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        simulador.tick();
        simulador.tick();

        expect(simulador.ejecutando).toBe(p2);

        expect(p1.quantumConsumido).toBe(0);
    });

     it("RF07 - Debe registrar cambios de contexto", () => {
        const simulador = new Simulador(1000, 2);
        const p1 = new Proceso("P1", 200, 5);
        const p2 = new Proceso("P2", 200, 5);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        simulador.tick();
        simulador.tick();

        expect(simulador.cambiosContexto).toBeGreaterThan(0);
    });

    it("RF08 - Debe bloquear un proceso por E/S", () => {
        const simulador =new Simulador(1000, 3);
        const proceso =new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);
        simulador.configurarES("P1",2,3);

        simulador.tick();
        simulador.tick();

        expect(proceso.estado).toBe("Bloqueado");
        expect(simulador.bloqueados).toContain(proceso);
    });

     it("RF08 - Un proceso bloqueado no debe ejecutar CPU", () => {
        const simulador = new Simulador(1000, 3);
        const p1 = new Proceso("P1", 200, 5);
        const p2 = new Proceso("P2", 200, 5);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);
        simulador.configurarES( "P1",1,3 );

        simulador.tick();
        simulador.tick();

        expect(p1.estado).toBe("Bloqueado");
        expect(simulador.ejecutando).toBe(p2);
    });


    it("RF08 - Debe devolver el proceso a Listo después de la E/S", () => {
        const simulador = new Simulador(1000, 3);
        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);
        simulador.configurarES("P1",1,2);

        simulador.tick();
        simulador.tick();

        expect(proceso.estado).toBe("Bloqueado");

        simulador.tick();

        expect(proceso.estado).not.toBe("Bloqueado");
    });

        it("RF08 - No debe aceptar E/S de un proceso inexistente", () => {
        const simulador = new Simulador(1000, 2);

        expect(() => simulador.configurarES("P99",2,3)
        ).toThrow();
    });


    it("RF09 - Debe calcular el porcentaje de uso de CPU", () => {
        const simulador =  new Simulador(1000, 2);
        const proceso = new Proceso("P1", 200, 3);

        simulador.registrarProceso(proceso);

        simulador.tick();
        simulador.tick();

        expect(simulador.porcentajeUsoCPU()).toBe(100);
    });


    it("RF09 - Debe calcular la memoria ocupada", () => {
        const simulador = new Simulador(1000, 2);
        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);
        simulador.tick();

        expect(simulador.memoriaOcupada()).toBe(200);
    });


    it("RF09 - Debe calcular la memoria libre", () => {
        const simulador = new Simulador(1000, 2);
        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);

        simulador.tick();

        expect(simulador.memoriaLibre()).toBe(800);
    });

    it("RF09 - Debe calcular el porcentaje de memoria ocupada", () => {
        const simulador = new Simulador(1000, 2);

        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);

        simulador.tick();

        expect(simulador.porcentajeMemoriaOcupada()).toBe(20);
    });

       it("RF09 - Debe obtener el mayor bloque libre", () => {
        const simulador = new Simulador(1000, 2);
        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);
        simulador.tick();

        expect(simulador.mayorBloqueLibre()).toBe(800);
    });

     it("RF09 - Debe calcular la fragmentación externa", () => {
        const simulador =new Simulador(1000, 2);
        const p1 =new Proceso("P1", 200, 1);
        const p2 =new Proceso("P2", 200, 5);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        simulador.tick();

        expect(simulador.memoriaOcupada()).toBe(200);
        expect(simulador.memoriaLibre() ).toBe(800);
    });

    it("RF10 - Debe exponer el estado actual del sistema", () => {
    const simulador = new Simulador(1000, 2);
    const p1 = new Proceso("P1", 200, 5);
    const p2 = new Proceso("P2", 200, 5);

    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);
    simulador.tick();

    expect(simulador.tickActual).toBe(1);
    expect(simulador.ejecutando).toBe(p1);
    expect(simulador.listos).toContain(p2);
    expect(simulador.esperandoMemoria).toHaveLength(0);
    expect(simulador.bloqueados).toHaveLength(0);
    expect(simulador.terminados).toHaveLength(0);
    expect(simulador.bloquesMemoria).toHaveLength(3);
});

it("RF10 - No debe haber más de un proceso ejecutándose", () => {
    const simulador =new Simulador(1000, 2);
    const p1 =new Proceso("P1", 200, 5);
    const p2 =new Proceso("P2", 200, 5);

    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);
    simulador.tick();

    expect(simulador.ejecutando).toBe(p1);
    expect(p2.estado).not.toBe("Ejecutando");
});

it("RF10 - Las vistas del sistema deben proteger el estado interno", () => {
    const simulador = new Simulador(1000, 2);
    const p1 = new Proceso("P1", 200, 5);
    const p2 = new Proceso("P2", 200, 5);

    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);

    simulador.tick();

    const listos =simulador.listos;

    listos.splice(0, 1);

    expect(simulador.listos).toContain(p2);
});

it("RF10 - No debe haber procesos duplicados en las colas", () => {
    const simulador = new Simulador(1000, 2);
    const p1 = new Proceso("P1", 200, 5);
    const p2 = new Proceso("P2", 200, 5);

    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);

    simulador.tick();
    simulador.tick();
    simulador.tick();

    const todos = [
        ...simulador.listos,
        ...simulador.bloqueados,
        ...simulador.terminados
    ];

    const ids =todos.map(proceso => proceso.pid);
    expect(new Set(ids).size).toBe(ids.length);
});

   
});