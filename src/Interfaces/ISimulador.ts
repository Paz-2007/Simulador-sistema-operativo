export interface ISimulador {
    readonly quantum: number;
    tick(): void;
}