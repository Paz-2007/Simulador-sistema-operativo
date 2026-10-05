import { Proceso } from "./Proceso";
import { AdministradorMemoria } from "./AdministradorMemoria";
import { BloqueMemoria } from "./BloqueMemoria";

import { ISimulador } from "./Interfaces/ISimulador";

export class Simulador implements ISimulador {
    private _memoria: AdministradorMemoria;
    private _quantum: number;   //quantum de round robin

    private _procesos: Proceso[]; //registro general de procesos

    //arrays separados de estados de procesos
    private _esperandoMemoria: Proceso[];
    private _listos: Proceso[];
    private _bloqueados: Proceso[];
    private _terminados: Proceso[];

    private _ejecutando: Proceso | null; //proceso que actalmente est usando la cpu

    private _tickActual: number;  //en que tick esta el simmulador
    private _ticksCPUOcupada: number; //cuantis ticks estuvo trabajando la cpu
    private _cambiosContexto: number;  //contador de campos de contexto

 

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
        //se crea un nuevo administrador de memoria con la memoria total y el quantum especificada

        this._quantum = quantum;
        //se asigna el quantum especificado

        this._procesos = [];
        // se crea un array de procesos

        this._esperandoMemoria=[];
        this._listos=[];
        this._bloqueados=[];
        this._terminados=[];
        //se crean los arrays de los diferentes estados de los procesos

        this._ejecutando=null;
        this._tickActual=0;
        this._ticksCPUOcupada=0;
        this._cambiosContexto=0;
        // se inicializan los contadores de ticks 
        // y cambios de contexto y el proceso ejecutando en nulo

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


    get procesos(): Proceso[] {
    return [...this._procesos];
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

    configurarES(pid: string,ticksParaBloqueo: number,duracionBloqueo: number): void {
        //toma el pid del proceso que se debe bloquear, cuando y cuanto tiempo
        const proceso =this._procesos.find(procesoBuscado =>procesoBuscado.pid === pid);

         proceso === undefined
        ? (() => {
              throw new Error("Proceso inexistente");
          })()
        : proceso.configurarEventoES(ticksParaBloqueo,duracionBloqueo
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

        const regresan =this._bloqueados.filter(proceso =>proceso.tiempoBloqueoRestante === 0); 
            //se filtran los procesos que ya no tienen tiempo de bloqueo restante

        regresan.forEach(
            proceso => {proceso.cambiarEstado("Listo");

                proceso.reiniciarQuantum();

                this._listos.push(proceso);
            }  //los procesos que regresan pasan a listo y se les reinicia su quantum
        );

        this._bloqueados =this._bloqueados.filter(proceso =>proceso.tiempoBloqueoRestante > 0);
        //se sacan de bloqueados los procesos listos, se quedan solo los que siguen bloqueados
    }

    private asignarSiguienteProceso(): void {
        const proceso =this._listos.shift()!; //toma el primer elemento del array listos

        proceso.cambiarEstado("Ejecutando");

        proceso.reiniciarQuantum();

        this._ejecutando = proceso; //asigna al proceso la cpu
    }

    private despachar(): void {
        this._ejecutando !== null 
            ? null  //si ya hay alquien ejecutando no hace nada
            : this._listos.length === 0  //si no pregunta si hay procesos listos
            ? null  //si no, no hace nada
            : this.asignarSiguienteProceso();  //si si asigna el siguiente proceso
    }

     private terminarProceso(proceso: Proceso): void {
        proceso.cambiarEstado("Terminado");

        this._memoria.liberar(proceso.pid);  //cuando el rpoceso termina devuelve la memoria que estaba usando

        this._terminados.push(proceso);  //guarda el proceso en terminados

        this._ejecutando = null;  //la cpu queda libre
    }

    private bloquearProceso( proceso: Proceso): void {
        proceso.bloquear(proceso.duracionBloqueo);  

        this._bloqueados.push(proceso);  //agrega el proceso a bloqueados

        this._cambiosContexto += 1;  //suma un cambio de contexto

        this._ejecutando = null;  //la cpu queda disponible
    }


     private reencolarProceso(proceso: Proceso): void {
        proceso.cambiarEstado("Listo");

        proceso.reiniciarQuantum();

        this._listos.push(proceso);

        this._cambiosContexto += 1;

        this._ejecutando = null;
    }

    private verificarQuantum(proceso: Proceso): void {
        this._listos.length > 0
            ? this.reencolarProceso(proceso)  
            : proceso.reiniciarQuantum();
    }

     private ejecutarCPU(): void {
        const proceso = this._ejecutando!; //obtiene el proceso que esta usando la cpu

        proceso.consumirCpu(); //consume un tick de cpu

        this._ticksCPUOcupada += 1;  //cuenta que la cpu estuvo ocupada durante ese tick

        proceso.tiempoCpuRestante === 0  //si el tiempo de cpu restante es 0
            ? this.terminarProceso(proceso)  //terminar el proceso
            : proceso.debeBloquearse()  //sino verifica si el proceso debe bloquarse
               ? this.bloquearProceso(proceso) // si si bloquea el proceso
             : proceso.quantumConsumido >=this._quantum //si no se bloquea, si el quantum consumido es mayor o igual al quantum 
            ? this.verificarQuantum(proceso)  //verifica el quantum del proceso
            : null;  //si nada de eso ocurre sigue ejecutando
    }


    tick(): void {  //un instante de tiempo de la simulacion
        this.admitirProcesos();  //intenta sacar procesos de esperando memoria y llevarlos a listo si consigue memoria
        this.actualizarBloqueados(); //los procesos bloqueados reducen su tiempo restante
        this.despachar();  //despacha los procesos, si no hay ndie usando la cpu pero hay procesos listos pasa de listos a ejecutando

        this._ejecutando !== null  //si hay alguien ejecutando
            ? this.ejecutarCPU()  //ejecuta 1 tick de cpu
            : null;  //sino la cpu queda libre

        this.despachar(); //despacha la cpu para buscar otro proceso listo

        this._tickActual += 1; //aumentar el tick
    }

    porcentajeUsoCPU(): number {
        return this._tickActual === 0  //si el tick ctual es 0 devolver 0
            ? 0
            : (this._ticksCPUOcupada /this._tickActual) * 100; 
            //sino calcular el porcentaje de uso de cpu
    }

    memoriaOcupada(): number {
        return this._memoria.memoriaOcupada();
    }

    memoriaLibre(): number {
        return this._memoria.memoriaLibre();
    }

    porcentajeMemoriaOcupada(): number {
        return this._memoria.porcentajeOcupacion();
    }

    mayorBloqueLibre(): number {
        return this._memoria.mayorBloqueLibre();
    }

    fragmentacionExterna(): number {
        return this._memoria.fragmentacionExterna();
    }


    }

   





