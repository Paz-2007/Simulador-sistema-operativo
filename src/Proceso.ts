export class Proceso {
    private _pid: string;
    private _tamanoMemoria: number;
    private _tiempoCpuTotal: number;
    private _tiempoCpuRestante: number;
    private _estado: string;
    private _quantumConsumido: number;
    private _tiempoBloqueoRestante: number;

    constructor( pid: string, tamanoMemoria: number, tiempoCpuTotal: number ) {
        this._pid = pid;
        this._tamanoMemoria = tamanoMemoria;
        this._tiempoCpuTotal = tiempoCpuTotal;
        this._tiempoCpuRestante = tiempoCpuTotal;
        this._estado = "Nuevo";
        this._quantumConsumido = 0;
        this._tiempoBloqueoRestante = 0;

       
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

    cambiarEstado(nuevoEstado:string): void{
        this._estado = nuevoEstado;
    }

    consumirCpu(): void {
        this._tiempoCpuRestante -= 1;
        this._quantumConsumido += 1;
    }

    reiniciarQuantum(): void {
        this._quantumConsumido = 0;
    }

    bloquear(ticks: number): void {
        if (ticks<=0 || !Number.isInteger(ticks)) {
            throw new Error("Proceso bloqueado");
            
        }
        this._estado = "Bloqueado"; 
        this._tiempoBloqueoRestante = ticks;
        //si el tick es 0 o el numero tiene decimales se bloquea el programa
    }

    actualizarBloqueo(): void {
        if (this._tiempoBloqueoRestante > 0) {
            this._tiempoBloqueoRestante -= 1;
        }
    }
}