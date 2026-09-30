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

    get inicio(): number {
        return this._inicio;
    }

    get tamano(): number {
        return this._tamano;
    }

    get libre(): boolean {
        return this._libre;
    }

    get pid(): string | null {
        return this._pid;
    }

    set tamano(valor: number) {
        this._tamano = valor;
    }

    set libre(valor: boolean) {
        this._libre = valor;
    }

    set pid(valor: string | null) {
        this._pid = valor;
    }
}