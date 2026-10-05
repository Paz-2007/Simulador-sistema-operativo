export interface IAdministradorMemoria {
    readonly memoriaTotal: number;

    asignar(pid: string, tamano: number): boolean;
    liberar(pid: string): boolean;
    memoriaOcupada(): number;
    memoriaLibre(): number;
    porcentajeOcupacion(): number;
    mayorBloqueLibre(): number;
    fragmentacionExterna(): number;
}