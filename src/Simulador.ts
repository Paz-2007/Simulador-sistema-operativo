import { Proceso } from "./Proceso";
import { AdministradorMemoria } from "./AdministradorMemoria";
import { BloqueMemoria } from "./BloqueMemoria";

export class Simulador {
    private _memoria: AdministradorMemoria;
    private _quantum: number;

    private _procesos: Map<string, Proceso>;

    private _esperandoMemoria: Proceso[];
    private _listos: Proceso[];
    private _bloqueados: Proceso[];
    private _terminados: Proceso[];

    private _ejecutando: Proceso | null;

    private _tickActual: number;
    private _ticksCPUOcupada: number;
    private _cambiosContexto: number;

}