import {IProceso} from "./IProceso";

export class Proceso implements IProceso {
    private _pid: string;
    private _tamanoMemoria: number;
    private _tiempoCpuTotal: number;
    private _tiempoCpuRestante: number;
    private _estado: string;
    private _quantumConsumido: number;
    private _tiempoBloqueoRestante: number;

    private _ticksCpuConsumidos: number;
    private _ticksParaBloqueo: number;
    private _duracionBloqueo: number;

    constructor( pid: string, tamanoMemoria: number, tiempoCpuTotal: number ) {
        if (tiempoCpuTotal <= 0 ||!Number.isInteger(tiempoCpuTotal)
        ) {throw new Error("El tiempo de CPU debe ser un entero positivo");
        }

        if (tamanoMemoria <= 0 ||!Number.isInteger(tamanoMemoria)
        ) {throw new Error("El tamaño de memoria debe ser un entero positivo");
    }
        //si el tiempo de cpu es 0 o el numero 
            // no es entero se lanza error
        
        
        this._pid = pid;
        this._tamanoMemoria = tamanoMemoria;
        this._tiempoCpuTotal = tiempoCpuTotal;
        this._tiempoCpuRestante = tiempoCpuTotal;
        this._estado = "Nuevo";
        this._quantumConsumido = 0;
        this._tiempoBloqueoRestante = 0;

       this._ticksCpuConsumidos = 0;
        this._ticksParaBloqueo = 0;
        this._duracionBloqueo = 0;
    }

    get pid(): string {
        return this._pid;
    }

    get tamanoMemoria(): number {
        return this._tamanoMemoria;
    }

    get tiempoCpuTotal(): number {
        return this._tiempoCpuTotal;
    }

    get tiempoCpuRestante(): number {
        return this._tiempoCpuRestante;
    }

    get estado(): string {
        return this._estado;
    }

    get quantumConsumido(): number {
        return this._quantumConsumido;
    }

    get tiempoBloqueoRestante(): number {
        return this._tiempoBloqueoRestante;
    }

    get ticksCpuConsumidos(): number {
        return this._ticksCpuConsumidos;
    }

    get ticksParaBloqueo(): number {
        return this._ticksParaBloqueo;
    }

    get duracionBloqueo(): number {
        return this._duracionBloqueo;
    }



    cambiarEstado(nuevoEstado:string): void{
        this._estado = nuevoEstado;
    }

    consumirCpu(): void {
        this._tiempoCpuRestante -= 1;
        this._quantumConsumido += 1;
        this._ticksCpuConsumidos += 1;
    }

    reiniciarQuantum(): void {
        this._quantumConsumido = 0;
    }

    bloquear(ticks: number): void {
    if (ticks <= 0 || !Number.isInteger(ticks)
        ) { throw new Error("La duración del bloqueo debe ser positiva");
        }

        this._estado = "Bloqueado";
        this._tiempoBloqueoRestante = ticks;
    }

    actualizarBloqueo(): void {
        if (this._tiempoBloqueoRestante > 0) {
            this._tiempoBloqueoRestante -= 1;
        } //si el tiempo de bloqueo es mayor a 0 se le resta 1 
    }

       debeBloquearse(): boolean {
        return (
            this._ticksParaBloqueo > 0 &&
            this._ticksCpuConsumidos === this._ticksParaBloqueo &&
            this._tiempoCpuRestante > 0
        ); // si el proceso tiene tick para bloquear y los ticks 
        // consumidos son iguales a los tickas para bloquear y el 
        // tiempo de cpu restante es mayor a 0 se bloquea el proceso
    }

    configurarEventoES(ticksParaBloqueo: number,duracionBloqueo: number): void {
    if (ticksParaBloqueo <= 0 || !Number.isInteger(ticksParaBloqueo)
    ) {throw new Error("Los ticks para E/S deben ser positivos");
    }

    if (duracionBloqueo <= 0 || !Number.isInteger(duracionBloqueo)
    ) { throw new Error( "La duración del bloqueo debe ser positiva");
    }

    this._ticksParaBloqueo =ticksParaBloqueo;

    this._duracionBloqueo = duracionBloqueo;
}

    
}