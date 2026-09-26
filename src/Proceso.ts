export class Proceso {
    private _pid: string = "";
    private _tamanoMemoria: number = 0;
    private _tiempoCpuTotal: number = 0;
    private _tiempoCpuRestante: number = 0;
    private _estado: string = "Nuevo";
    private _quantumConsumido: number = 0;
    private _tiempoBloqueoRestante: number = 0;

    constructor(pid: string, tamanoMemoria: number, tiempoCpuTotal: number) {
        this._pid = pid;
        this._tamanoMemoria = tamanoMemoria;
        this._tiempoCpuTotal = tiempoCpuTotal;
        this._tiempoCpuRestante = tiempoCpuTotal;
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

    set estado(nuevoEstado: string) {
        this._estado = nuevoEstado;
    }

    set tiempoCpuRestante(tiempo: number) {
        this._tiempoCpuRestante = tiempo;
    }

    set quantumConsumido(quantum: number) {
        this._quantumConsumido = quantum;
    }

    set tiempoBloqueoRestante(tiempo: number) {
        this._tiempoBloqueoRestante = tiempo;
    }
}