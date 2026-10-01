import {BloqueMemoria} from "./BloqueMemoria"
import {Proceso} from "./Proceso"

export class AdministradorMemoria {
    private _tamanoTotal: number = 0;
    private _bloques: BloqueMemoria[] = [];

    constructor(tamanoTotal: number) {
        if(tamanoTotal <= 0||!Number.isInteger(tamanoTotal)){
            throw new Error("La memoria debe ser un entero positivo");
        }

        this._tamanoTotal=tamanoTotal;
        this._bloques=[new BloqueMemoria(0,tamanoTotal)];

    }
}