export interface IProceso {
    readonly pid: string;
    readonly estado: string;
    readonly tamanoMemoria: number;
    readonly tiempoCpuTotal: number;
    readonly tiempoCpuRestante: number;
}