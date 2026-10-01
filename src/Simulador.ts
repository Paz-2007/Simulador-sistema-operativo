import { Proceso } from "./Proceso";
import { AdministradorMemoria } from "./AdministradorMemoria";
import { BloqueMemoria } from "./BloqueMemoria";

export class Simulador {
    private _memoria: AdministradorMemoria;
    private _quantum: number;

    private _procesos: Map<string, Proceso>;

    private _esperandoMemoria: Proceso[];
    private _listos: Proceso[];
    private _bloqueados: Proceso[];
    private _terminados: Proceso[];

    private _ejecutando: Proceso | null;

    private _tickActual: number;
    private _ticksCPUOcupada: number;
    private _cambiosContexto: number;

    constructor(memoriaTotal: number, quantum: number) {
        if (memoriaTotal <= 0 ||!Number.isInteger(memoriaTotal)
        ) { // si la memoria total es menor o igual a 0 
              //o no es un entero se lanza error
            throw new Error("La memoria debe ser positiva");
        }


        if (quantum <= 0 ||!Number.isInteger(quantum)) {
            throw new Error("El quantum debe ser positivo");
        } // si el quantum es menor o igual a 0 se lanza error

        this._memoria = new AdministradorMemoria(memoriaTotal);
        //se crea un nuevo administrador de memoria con la memoria total especificada

        this._quantum = quantum;
        //se asigna el quantum especificado

        this._procesos = new Map();
        // se crea un mapa para almacenar los procesos por su pid

        this._esperandoMemoria=[];
        this._listos=[];
        this._bloqueados=[];
        this._terminados=[];
        //se crean arreglos para almacenar los procesos 
        // en diferentes estados

        this._ejecutando=null;
        this._tickActual=0;
        this._ticksCPUOcupada=0;
        this._cambiosContexto=0;
        // se inicializan los contadores de ticks 
        // y cambios de contexto y el proceso en nulo

}

get memoriaTotal(): number {
        return this._memoria.memoriaTotal;
    }

    get quantum(): number {
        return this._quantum;
    }

    get tickActual(): number {
        return this._tickActual;
    }

    get ejecutando(): Proceso | null {
        return this._ejecutando;
    }

    get esperandoMemoria(): Proceso[] {
        return [...this._esperandoMemoria];
    }

    

}