import { IBloqueMemoria } from "./Interfaces/IBloqueMemoria";

export class BloqueMemoria implements IBloqueMemoria {
    private _inicio: number;  //desde que posicin de memoria comienza el bloque
    private _tamano: number; //cuanto mide ese bloque
    private _libre: boolean;  
    private _pid: string | null;  //identificacion del proceso que esta ocpando ese bloque



    constructor(inicio: number, tamano:number){
        this._inicio=inicio;
        this._tamano=tamano;
        this._libre=true;
        this._pid=null
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

    set inicio(valor: number) { this._inicio = valor; }

    set tamano(valor: number) { this._tamano = valor; }

    set libre(valor: boolean) { this._libre = valor; }

    set pid(valor: string | null) { this._pid = valor; }

    ocupar(pid:string): void{
        if (!this._libre){
            throw new Error("El bloque ya esta ocupado");
        }
            this._libre=false; 
            this._pid=pid;
            //si el bloque no esta libre se lanza error, 
            // si esta libre se ocupa y se asigna el pid 
            // del proceso que lo ocupa
    }

    liberar(): void{
        this._libre=true;
        this._pid=null;
    }
}
