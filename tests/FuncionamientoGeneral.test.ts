import { describe, it, expect } from "vitest";
import { Simulador } from "../src/Simulador";
import { Proceso } from "../src/Proceso";
import {AdministradorMemoria} from "../src/AdministradorMemoria";
import { BloqueMemoria } from "../src/BloqueMemoria";

it("Prueba general - Debe ejecutar un escenario completo del simulador", () => {
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

