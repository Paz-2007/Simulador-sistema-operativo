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

    get bloques():Bloquememoria[]{
        return [...this._bloques];
    }

    
}