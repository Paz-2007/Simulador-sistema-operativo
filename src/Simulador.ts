import { Proceso } from "./Proceso";
import { AdministradorMemoria } from "./AdministradorMemoria";
import { BloqueMemoria } from "./BloqueMemoria";

export interface ISimulador {
    readonly quantum: number;
}

export class Simulador implements ISimulador {
    private _memoria: AdministradorMemoria;
    private _quantum: number;

    private _procesos: Proceso[];

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

        this._procesos = [];
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

    get listos(): Proceso[] {
        return [...this._listos];
    }

    get bloqueados(): Proceso[] {
        return [...this._bloqueados];
    }

    get terminados(): Proceso[] {
        return [...this._terminados];
    }

    get cambiosContexto(): number {
        return this._cambiosContexto;
    }

    get bloquesMemoria(): BloqueMemoria[] {
        return this._memoria.bloques;
    }

    registrarProceso(proceso: Proceso): void {
        const existe =this._procesos.some(procesoExistente =>procesoExistente.pid === proceso.pid);
        //se verifica si el proceso ya existe en el arreglo de procesos

        if (existe) {
            throw new Error("El PID ya existe");
        }

        if (proceso.tamanoMemoria >this._memoria.memoriaTotal
        ) {throw new Error("El proceso requiere más memoria que la disponible");

        } //si el tamano de memoria del proceso es mayor que la memoria total se lanza error

        this._procesos.push(proceso);
        //se agrega el proceso al arreglo de procesos

        proceso.cambiarEstado("Esperando Memoria");

        this._esperandoMemoria.push(proceso);
        //se agrega el proceso al arreglo de procesos esperando memoria
      
    }

    configurarIO(
        pid: string,
        ticksParaBloqueo: number,
        duracionBloqueo: number
    ): void {
        const proceso =
            this._procesos.find(
                procesoBuscado =>
                    procesoBuscado.pid === pid
            );

        if (proceso === undefined) {
            throw new Error(
                "Proceso inexistente"
            );
        }

        proceso.configurarEventoES(
            ticksParaBloqueo,
            duracionBloqueo
        );
    }

    private admitirProcesos(): void {
        let indice = 0;

        while (indice <this._esperandoMemoria.length) {
            //se recorre el arreglo de procesos esperando memoria

            const proceso =this._esperandoMemoria[indice];
            //se obtiene el proceso en la posicion actual del arreglo

            const asignado =this._memoria.asignar(proceso.pid,proceso.tamanoMemoria);
            //se intenta asignar memoria al proceso

            asignado? (proceso.cambiarEstado("Listo"),
                    this._listos.push(proceso
                        // si se asigna memoria al proceso se cambia su estado a listo
                        // y se agrega al arreglo de procesos listos
                    ), 
                    this._esperandoMemoria.splice(indice, 1
                        //se elimina el proceso del arreglo de procesos esperando memoria
                    ) 
                )
                : indice += 1; 
                // si no se asigna memoria al proceso se incrementa el indice 
                // para pasar al siguiente proceso
        }
    }

    private actualizarBloqueados(): void {
        this._bloqueados.forEach(proceso =>proceso.actualizarBloqueo()
        ); //se actualiza el tiempo de bloqueo dentro de cada proceso bloqueado

        const regresan =this._bloqueados.filter(proceso =>proceso.tiempoBloqueoRestante === 0
            ); //se filtran los procesos que ya no tienen tiempo de bloqueo restante

        regresan.forEach(
            proceso => {proceso.cambiarEstado("Listo"
                );

                proceso.reiniciarQuantum();

                this._listos.push(proceso
                );
            }
        );

        this._bloqueados =this._bloqueados.filter(
                proceso =>
                    proceso.tiempoBloqueoRestante > 0
            );
    }

    private asignarSiguienteProceso(): void {
        const proceso =this._listos.shift()!;

        proceso.cambiarEstado("Ejecutando");

        proceso.reiniciarQuantum();

        this._ejecutando = proceso;
    }

    private despachar(): void {
        this._ejecutando !== null
            ? null
            : this._listos.length === 0
            ? null
            : this.asignarSiguienteProceso();
    }

     private terminarProceso(
        proceso: Proceso): void {
        proceso.cambiarEstado("Terminado"
        );

        this._memoria.liberar(proceso.pid
        );

        this._terminados.push(proceso
        );

        this._ejecutando = null;
    }
    
    



    

    }

   





