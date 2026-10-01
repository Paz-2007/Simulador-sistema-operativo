import {BloqueMemoria} from "./BloqueMemoria"
import {Proceso} from "./Proceso"

export class AdministradorMemoria {
    private _memoriaTotal: number = 0;
    private _bloques: BloqueMemoria[] = [];

    constructor(tamanoTotal: number) {
        if(this.memoriaTotal <= 0||!Number.isInteger(this.memoriaTotal)){
            throw new Error("La memoria debe ser un entero positivo");
        }

        this._memoriaTotal=tamanoTotal;
        this._bloques=[new BloqueMemoria(0,this._memoriaTotal)];

    }

    get memoriaTotal():number{
        return this._memoriaTotal;

    }

    get bloques():BloqueMemoria[]{
        return [...this._bloques];
    }

        asignar(pid: string, tamano: number): boolean {
        const indice = this._bloques.findIndex(bloque => bloque.libre && bloque.tamano >= tamano);

        if (indice === -1) {
            return false;
        }

        const bloque = this._bloques[indice];

        if (bloque.tamano === tamano) {bloque.ocupar(pid);
            return true;
        } // si el bloque es exactamente del tamano requerido se ocupa 
        // y se retoma la ejecucion

        const ocupado = new BloqueMemoria(bloque.inicio,tamano); //se curea un nuevo bloque con el tamano requerdo

        ocupado.ocupar(pid); //se ocupa el bloque con el tamano requerido 
        //y se le asigna el pid al proceso que lo solicita

        const libre = new BloqueMemoria(bloque.inicio + tamano,bloque.tamano - tamano);
        //se crea un nuevo bloque con el tamano restante del bloque original

        this._bloques.splice(indice,1,ocupado,libre);
        //se reemplaza el bloque original por los dos nuevos bloques (ocupado y libre)

        return true;
        //se retorna true indicando que la memoria se pudo asignar al proceso
    
    } 
}