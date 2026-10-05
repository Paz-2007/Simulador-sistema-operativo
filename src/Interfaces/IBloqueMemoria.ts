export interface IBloqueMemoria {
    readonly inicio: number;
    readonly tamano: number;
    readonly libre: boolean;
    readonly pid: string | null;
}