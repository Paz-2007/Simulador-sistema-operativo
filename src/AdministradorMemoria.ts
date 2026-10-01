import {BloqueMemoria} from "./BloqueMemoria"
import {Proceso} from "./Proceso"

export class AdministradorMemoria {
    private _memoriaTotal: number = 0;
    private _bloques: BloqueMemoria[] = [];

    constructor(memoriaTotal: number) {
        if(memoriaTotal <= 0||!Number.isInteger(this.memoriaTotal)){
            throw new Error("La memoria debe ser un entero positivo");
        }

        this._memoriaTotal=memoriaTotal;
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

   private coalescer(): void {
        let indice = 0;

        while (indice < this._bloques.length - 1) {
            const actual = this._bloques[indice];
            const siguiente = this._bloques[indice + 1];
            //si el bloque actual y el siguiente son libres, se combinan en un solo bloque

            if (actual.libre && siguiente.libre) {
                const nuevo = new BloqueMemoria(actual.inicio,actual.tamano + siguiente.tamano
                ); //se crea un nuevo bloque con el inicio del bloque actual 
                //y el tamano de la suma de los dos bloques libres

                this._bloques.splice(indice,2,nuevo); //se reemplazan los dos bloques libres por el nuevo bloque combinado
            } else {
                indice += 1;
            } //si no se pueden combinar se pasa al siguiente bloque
            //se incrementa el indice para seguir con la iteracion
            //y verificar el siguiente bloque
        }
    }

     liberar(pid: string): boolean {
        const indice = this._bloques.findIndex(
            bloque => !bloque.libre && bloque.pid === pid
        ); //se busca el indice del bloque ocupado con el pid especificado

        if (indice === -1) {
            return false;
        } //si no se encuentra un bloque ocupado con el pid especificado se retorna false
        // indicando que no se pudo liberar la memoria

        this._bloques[indice].liberar(); 
        //si se encuentra un bloque ocupado con el pid especificado se libera la memoria

        this.coalescer(); //el metodo coalescer combina los bloques libres adyacentes

        return true;
    }

    memoriaOcupada(): number { //se calcula la memoria ocupada sumando el tamano de los bloques ocupados
        return this._bloques.filter(bloque => !bloque.libre).reduce( 
            // se filtran los bloques ocupados y se suman los tamanos usando reduce
                (total, bloque) => total + bloque.tamano,0);
                //se retorna la memoria ocupada
    }

    memoriaLibre(): number {
        return this._memoriaTotal - this.memoriaOcupada();
    } //se calcula la memoria libre restando la memoria ocupada a la memoria total

    porcentajeOcupacion(): number {
        return (this.memoriaOcupada() /this._memoriaTotal) * 100;
    } //se calcla el porcentaje de ocupacion dividiendo la memoria ocupada entre la memoria total y multiplicando por 100

    mayorBloqueLibre(): number { 
        return this._bloques.filter(bloque => bloque.libre)
        .reduce((mayor, bloque) => 
            // se filtran los bloques libres y se busca el bloque con el mayor tamano usando reduce
                    Math.max(mayor, bloque.tamano),
                    //se retorna el tamano del mayor bloque libre
                0 //si no hay bloques libres se retorna 0
            );
    } 

    fragmentacionExterna(): number {
        const libre = this.memoriaLibre();

        if (libre === 0) { 
            return 0;
            //si no hay memoria libres se retorna 0 
            // que indica que no hay fragmentacion externa
        }

        return (1 -this.mayorBloqueLibre() / libre
        ) * 100;
        //si hay meoria libre se calcula la fragmentacion 
        // externa dividiendo el tamano del mayor bloque
        // libre entre la memoria libre total y restando el resultado a 1
    }


}