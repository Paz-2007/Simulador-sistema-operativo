import {IProceso} from "./Interfaces/IProceso";

export class Proceso implements IProceso {
    private _pid: string;  //identificador
    private _tamanoMemoria: number;  //cuanta memoria necesita
    private _tiempoCpuTotal: number;  //cuanta cpu necesita para completarse
    private _tiempoCpuRestante: number;  //tiempo de cpu que le falta
    private _estado: string;   //nuevo, ejecutando, bloqueado, esperando, listo
    private _quantumConsumido: number;   //cuanto de su quantum consumio
    private _tiempoBloqueoRestante: number;  //tiempo que le falta estando bloqueado

      //info para controlar el evento E/S 
    private _ticksCpuConsumidos: number;  //cuntos ticks de cpu lleva consumidos
    private _ticksParaBloqueo: number;  /// cuantos ticks de cpu deben pasar para bloquearse
    private _duracionBloqueo: number;  //cuanto dura el bloqueo

    constructor( pid: string, tamanoMemoria: number, tiempoCpuTotal: number ) {
        if (tiempoCpuTotal <= 0 ||!Number.isInteger(tiempoCpuTotal)
        ) {throw new Error("El tiempo de CPU debe ser un entero positivo");
        }

        if (tamanoMemoria <= 0 ||!Number.isInteger(tamanoMemoria)
        ) {throw new Error("El tamaño de memoria debe ser un entero positivo");
    }
        //si el tiempo de cpu es 0 o menor o 
            // no es entero se lanza error
        
        
        this._pid = pid;
        this._tamanoMemoria = tamanoMemoria;
        this._tiempoCpuTotal = tiempoCpuTotal;
        this._tiempoCpuRestante = tiempoCpuTotal;
        this._estado = "Nuevo";
        this._quantumConsumido = 0;
        this._tiempoBloqueoRestante = 0;

       this._ticksCpuConsumidos = 0;
        this._ticksParaBloqueo = 0;
        this._duracionBloqueo = 0;
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

    get ticksCpuConsumidos(): number {
        return this._ticksCpuConsumidos;
    }

    get ticksParaBloqueo(): number {
        return this._ticksParaBloqueo;
    }

    get duracionBloqueo(): number {
        return this._duracionBloqueo;
    }

    set pid(valor: string) { 
       this._pid = valor; }

   set tamanoMemoria(valor: number) { 
     this._tamanoMemoria = valor; }

  set tiempoCpuTotal(valor: number) {
     this._tiempoCpuTotal = valor; }

 set tiempoCpuRestante(valor: number) { 
     this._tiempoCpuRestante = valor; }



    cambiarEstado(nuevoEstado:string): void{
        this._estado = nuevoEstado;
    }     

    consumirCpu(): void {
        this._tiempoCpuRestante -= 1;
        this._quantumConsumido += 1;
        this._ticksCpuConsumidos += 1;
    }  //cuando consume cpu se resta 1 al tiempo, se suma 
    //al quantum consumido y se suma a los ticks consumidos

    reiniciarQuantum(): void {
        this._quantumConsumido = 0;
    }  //reinicia el quantum para cuando un proceso vuelva a ejecutarse

    bloquear(ticks: number): void {  //toma los ticks de bloqueo
    if (ticks <= 0 || !Number.isInteger(ticks)
        ) { throw new Error("La duración del bloqueo debe ser positiva");
        }  //tirar error si la duracion de bloqueo es negativa

        this._estado = "Bloqueado";
        this._tiempoBloqueoRestante = ticks;
    }   //bloquea por la cantidad de ticks de bloqueo

    actualizarBloqueo(): void {
        if (this._tiempoBloqueoRestante > 0) {
            this._tiempoBloqueoRestante -= 1;
        } //si el tiempo de bloqueo es mayor a 0 (todavia queda 
        // tiempo de bloqueo)  se le resta 1 
    }

       debeBloquearse(): boolean {
        return (
            this._ticksParaBloqueo > 0 &&
            this._ticksCpuConsumidos === this._ticksParaBloqueo &&
            this._tiempoCpuRestante > 0
        ); // si el proceso tiene tick para bloquear y los ticks 
        // consumidos son iguales a los tickss para bloquear y el 
        // tiempo de cpu restante es mayor a 0 responde si debe bloquearse o no
    }

    configurarEventoES(ticksParaBloqueo: number,duracionBloqueo: number): void {
        //cuando se va a producir una E/S y cuanto durara el bloqueo

    if (ticksParaBloqueo <= 0 || !Number.isInteger(ticksParaBloqueo)
    ) {throw new Error("Los ticks para E/S deben ser positivos");
    }  //tira error si el numero de ticks para e/s es negativo

    if (duracionBloqueo <= 0 || !Number.isInteger(duracionBloqueo)
    ) { throw new Error( "La duración del bloqueo debe ser positiva");
    }   //tira error si la duracion del bloqueo es negativa

    this._ticksParaBloqueo =ticksParaBloqueo;

    this._duracionBloqueo = duracionBloqueo;
    //guarda los valores de cuando y cuanto se va a bloquear
}

    
}