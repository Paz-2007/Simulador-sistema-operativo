export class Proceso {
    private _pid: string;
    private _tamanoMemoria: number;
    private _tiempoCpuTotal: number;
    private _tiempoCpuRestante: number;
    private _estado: string;
    private _quantumConsumido: number;
    private _tiempoBloqueoRestante: number;

    constructor(
        pid: string,
        tamanoMemoria: number,
        tiempoCpuTotal: number
    ) {
        this._pid = pid;
        this._tamanoMemoria = tamanoMemoria;
        this._tiempoCpuTotal = tiempoCpuTotal;
        this._tiempoCpuRestante = tiempoCpuTotal;
        this._estado = "NUEVO";
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

    set estado(valor: string) {
        this._estado = valor;
    }

    set tiempoCpuRestante(valor: number) {
        this._tiempoCpuRestante = valor;
    }

    set quantumConsumido(valor: number) {
        this._quantumConsumido = valor;
    }

    set tiempoBloqueoRestante(valor: number) {
        this._tiempoBloqueoRestante = valor;
    }
}