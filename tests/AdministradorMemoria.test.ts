import {describe, it,expect} from "vitest";
import {AdministradorMemoria} from "../src/AdministradorMemoria";

describe("AdministradorMemoria", () => {
    
    it('Debe crear un administrador de memoria con el tamano especificado', () => {
     const administrador = new AdministradorMemoria(1024);
     expect (administrador.memoriaLibre()).toBe(1024)    
    })
});