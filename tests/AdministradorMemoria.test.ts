import {describe, it,expect} from "vitest";
import {AdministradorMemoria} from "../src/AdministradorMemoria";

describe("AdministradorMemoria", () => {
    
    it('Debe crear un administrador de memoria con el tamano especificado', () => {
     const administrador = new AdministradorMemoria(1024);
     expect (administrador.memoriaLibre()).toBe(1024)    
    });

    it("Debe iniciar con toda la memoria libre", () => {
        const memoria =new AdministradorMemoria(1000);

        expect(memoria.memoriaTotal).toBe(1000); //se verifica que se creo con el tamano
        expect(memoria.memoriaLibre()).toBe(1000); //va a estar libre
        expect(memoria.memoriaOcupada()).toBe(0); //no va a estar ocupada
        expect(memoria.bloques.length).toBe(1); //va a tener un solo bloque ya que esta vacia
    });

    it("Debe asignar usando First-Fit", () => {
        const memoria =new AdministradorMemoria(1000);

        expect(memoria.asignar("P1", 200)).toBe(true); //se espera que la asignacion sea exitosa

        expect(memoria.bloques[0].pid).toBe("P1");  //verifica que el pid del bloque sea el que se le asigno
        expect(memoria.bloques[0].tamano).toBe(200);  //verifica que se le haya asignado el tamano indicado
        
        //se verifica que se haya generado un segundo bloque libre
        expect(memoria.bloques[1].libre).toBe(true); 
        expect(memoria.bloques[1].tamano).toBe(800);
    });
    
     it("Debe dividir un bloque cuando sobra memoria", () => {
        const memoria =new AdministradorMemoria(1000);
        
        memoria.asignar("P1", 300);

        // Se divide en 2 bloques
        expect(memoria.bloques.length).toBe(2);

        // Uno va a tener los 300kb ocupados
        expect(memoria.bloques[0].tamano).toBe(300);

        // El otro va a tener los 700KB libres
        expect(memoria.bloques[1].tamano).toBe(700);
    });

     it("Debe liberar memoria", () => {
        const memoria =new AdministradorMemoria(500);

        memoria.asignar("P1", 200);

        // Liberamos la memoria ocupada por P1
        memoria.liberar("P1");

        // Toda la memoria vuelve a estar disponible
        expect(memoria.memoriaLibre()).toBe(500);

        // Los bloques adyacentes se unen por lo que se vuelve a tener un unico bloque
        expect(memoria.bloques.length).toBe(1);
    });

    it("Debe calcular memoria libre", () => {
        const memoria = new AdministradorMemoria(1000);

        memoria.asignar("P1", 300);

        expect(memoria.memoriaLibre()).toBe(700);
    });

    it("Debe rechazar una asignación si no existe un bloque suficiente", () => {
        const memoria =new AdministradorMemoria(500);
        
        memoria.asignar("P1", 300);

        // Si intentamos asignar 250 KB a P2
        // Solamente quedan 200 KB asi que falla
        expect(memoria.asignar("P2", 250)).toBe(false);
    });

    it("Debe realizar coalescencia de bloques libres", () => {
        const memoria = new AdministradorMemoria(1000);

        memoria.asignar("P1", 200);
        memoria.asignar("P2", 300);

        memoria.liberar("P1");
        memoria.liberar("P2");

        // Como los tres bloques adyascentes se unen la memoria vuelve a ser un solo bloque
        expect(memoria.bloques.length).toBe(1);
        expect(memoria.bloques[0].tamano).toBe(1000);
        expect(memoria.bloques[0].libre).toBe(true);
    });

        it("Debe calcular memoria ocupada", () => {
        const memoria = new AdministradorMemoria(1000);

        memoria.asignar("P1", 300);
        memoria.asignar("P2", 200);

        expect(memoria.memoriaOcupada()).toBe(500);
    });

    it("Debe calcular el mayor bloque libre", () => {
        const memoria =new AdministradorMemoria(1000);

        memoria.asignar("P1", 300);
        memoria.asignar("P2", 200);

        memoria.liberar("P1");

        // La memoria queda [Libre 300] [P2 200] [Libre 500]
        expect(memoria.mayorBloqueLibre()).toBe(500);
    });

    it("Debe calcular la ocupación porcentual", () => {
        const memoria = new AdministradorMemoria(1000);

        memoria.asignar("P1", 250);

        // 250 de 1000 es un 25%
        expect(memoria.porcentajeOcupacion()).toBe(25);
    });

     it("Debe calcular fragmentación externa", () => {
        const memoria = new AdministradorMemoria(1000);

        memoria.asignar("P1", 200);
        memoria.asignar("P2", 200);
        memoria.asignar("P3", 200);

        memoria.liberar("P1");
        memoria.liberar("P2");


        // [Libre 400] [P3 200] [Libre 400]
        // Hay 800 KB libres en total y el mayor bloque libre es de 400 KB

        // Fragmentacion (1 - 400 / 800) * 100 = 50%
        expect(memoria.fragmentacionExterna()).toBe(50);
    });

});