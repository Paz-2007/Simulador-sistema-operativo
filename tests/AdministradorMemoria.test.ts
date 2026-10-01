import {describe, it,expect} from "vitest";
import {AdministradorMemoria} from "../src/AdministradorMemoria";

describe("AdministradorMemoria", () => {
    
    it('Debe crear un administrador de memoria con el tamano especificado', () => {
     const administrador = new AdministradorMemoria(1024);
     expect (administrador.memoriaLibre()).toBe(1024)    
    });

    it("Debe iniciar con toda la memoria libre", () => {
        const memoria =
            new AdministradorMemoria(1000);

        expect(memoria.memoriaTotal).toBe(1000);
        expect(memoria.memoriaLibre()).toBe(1000);
        expect(memoria.memoriaOcupada()).toBe(0);
        expect(memoria.bloques.length).toBe(1);
    });

    it("Debe asignar usando First-Fit", () => {
        const memoria =new AdministradorMemoria(1000);

        expect(memoria.asignar("P1", 200)).toBe(true);

        expect(memoria.bloques[0].pid).toBe("P1");
        expect(memoria.bloques[0].tamano).toBe(200);
        expect(memoria.bloques[1].libre).toBe(true);
        expect(memoria.bloques[1].tamano).toBe(800);
    });
    
     it("Debe dividir un bloque cuando sobra memoria", () => {
        const memoria =new AdministradorMemoria(1000);memoria.asignar("P1", 300);

        expect(memoria.bloques.length).toBe(2);
        expect(memoria.bloques[0].tamano).toBe(300);
        expect(memoria.bloques[1].tamano).toBe(700);
    });

     it("Debe liberar memoria", () => {
        const memoria =new AdministradorMemoria(500);

        memoria.asignar("P1", 200);
        memoria.liberar("P1");

        expect(memoria.memoriaLibre()).toBe(500);
        expect(memoria.bloques.length).toBe(1);
    });

    it("Debe calcular memoria libre", () => {
        const memoria =new AdministradorMemoria(1000);

        memoria.asignar("P1", 300);

        expect(memoria.memoriaLibre()).toBe(700);
    });

    it("Debe rechazar una asignación si no existe un bloque suficiente", () => {
        const memoria =new AdministradorMemoria(500);
        
        memoria.asignar("P1", 300);

        expect(memoria.asignar("P2", 250)).toBe(false);
    });

    it("Debe realizar coalescencia de bloques libres", () => {
        const memoria =
            new AdministradorMemoria(1000);

        memoria.asignar("P1", 200);
        memoria.asignar("P2", 300);

        memoria.liberar("P1");
        memoria.liberar("P2");

        expect(memoria.bloques.length).toBe(1);
        expect(memoria.bloques[0].tamano).toBe(1000);
        expect(memoria.bloques[0].libre).toBe(true);
    });

        it("Debe calcular memoria ocupada", () => {
        const memoria =
            new AdministradorMemoria(1000);

        memoria.asignar("P1", 300);
        memoria.asignar("P2", 200);

        expect(memoria.memoriaOcupada()).toBe(500);
    });

    it("Debe calcular el mayor bloque libre", () => {
        const memoria =new AdministradorMemoria(1000);

        memoria.asignar("P1", 300);
        memoria.asignar("P2", 200);

        memoria.liberar("P1");

        expect(memoria.mayorBloqueLibre()).toBe(500);
    });






   










});