export class BloqueMemoria {
    private _inicio: number;
    private _tamano: number;
    private _libre: boolean;
    private _pid: string | null;

    constructor(
        inicio: number,
        tamano: number,
        libre: boolean = true,
        pid: string | null = null
    ) {
        this._inicio = inicio;
        this._tamano = tamano;
        this._libre = libre;
        this._pid = pid;
    }

}