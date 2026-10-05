import { describe, it, expect } from "vitest";
import { Simulador } from "../src/Simulador";
import { Proceso } from "../src/Proceso";

describe("SimuladorSO", () => {

   
it("RF01 - Debe rechazar memoria inválida", () => {
        expect(() => new Simulador(0, 2)).toThrow();
    });


    it("RF01 - Debe rechazar quantum inválido", () => {
        expect(() => new Simulador(1024, 0)).toThrow();
    });


    it("RF02 - Debe registrar un proceso", () => {
        const simulador =new Simulador(1024, 2);
        //se crea un simulador con 1024 de memoria y quantum de 2 ticks
        const proceso =new Proceso("P1", 200, 4);
        //se crea el proceso p1 con memoria de 200 y cpu total de 4 ticks

        simulador.registrarProceso(proceso);

        expect(simulador.esperandoMemoria.length).toBe(1); //debe haber 1 proceso esperando memoria
        expect(proceso.estado).toBe("Esperando Memoria");  
    });


     it("RF02 - No debe aceptar PID duplicado", () => {
        const simulador = new Simulador(1024, 2);
        const p1 =new Proceso("P1", 200, 4);
        const p2 =new Proceso("P1", 100, 2);

        simulador.registrarProceso(p1);

        expect(() => simulador.registrarProceso(p2)).toThrow();
    });


    it("RF02 - No debe aceptar un proceso mayor que la memoria", () => {
        const simulador = new Simulador(500, 2);
        const proceso = new Proceso("P1", 600, 4);

        expect(() => simulador.registrarProceso(proceso)).toThrow();
    });

      it("RF03 - Debe pasar un proceso a Listo cuando obtiene memoria", () => {
        const simulador = new Simulador(1024, 2);
        const proceso =new Proceso("P1", 200, 4);

        simulador.registrarProceso(proceso);
        simulador.tick();

        expect(proceso.estado).toBe("Ejecutando");
    });

     it("RF03 - Debe dejar esperando a un proceso sin memoria suficiente", () => {
        const simulador = new Simulador(500, 2);
        const p1 =new Proceso("P1", 400, 4);
        const p2 =new Proceso("P2", 200, 4);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        // P1 ocupa 400
        // Quedan solamente 100 libres
    
        // P2 necesita 200, por lo que no puede entrar
        // y permanece esperando memoria

        simulador.tick();

        expect(p2.estado).toBe("Esperando Memoria");
    });


    it("RF04 - Debe asignar memoria contigua", () => {
        const simulador =new Simulador(1000, 2);
        const p1 = new Proceso("P1", 300, 4);

        simulador.registrarProceso(p1);

        // Se asigna memoria a P1
        simulador.tick();

        // Obtenemos los bloques actuales de memoria
        const bloques = simulador.bloquesMemoria;

        // El primer bloque empieza en la posición 0
        expect(bloques[0].inicio).toBe(0);

        // El primer bloque tiene tamaño 300
        expect(bloques[0].tamano).toBe(300);

        // El primer bloque pertenece a P1
        expect(bloques[0].pid).toBe("P1");

        // El bloque libre comienza donde termina P1 osea posición 300
        expect(bloques[1].inicio).toBe(300);

        // Si P1 ocupa 300 de 1000 quedan 700 libres
        expect(bloques[1].tamano).toBe(700);
    });

     it("RF05 - Debe liberar memoria al terminar un proceso", () => {
        const simulador = new Simulador(500, 2);
        const proceso = new Proceso("P1", 200, 1);

        simulador.registrarProceso(proceso);

        // P1 ejecuta su unico tick
        // Como no le queda CPU, termina
        simulador.tick();

        expect(proceso.estado).toBe("Terminado");

        // Al terminar, su memoria se libera
        // Por lo tanto vuelven a quedar los 500 libres
        expect(simulador.memoriaLibre()).toBe(500);
    });


      it("RF06 - Debe avanzar un tick por llamada", () => {
        const simulador = new Simulador(500, 2);

        expect(simulador.tickActual).toBe(0);
        //primero el tick actual es 0

        simulador.tick();

        //ahora debe avanzar un tick
        expect(simulador.tickActual).toBe(1);

        simulador.tick();

        //ahora debio avanzar 2 ticks
        expect(simulador.tickActual).toBe(2);
    });


    it("RF07 - Debe ejecutar procesos con Round Robin", () => {
        const simulador =new Simulador(1000, 2);
        //quantum = 2
        const p1 =new Proceso("P1", 200, 4);
        const p2 =new Proceso("P2", 200, 4);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        // Primer tick, P1 consigue la CPU
        simulador.tick();

        expect(simulador.ejecutando).toBe(p1);

        // Segundo tick, P1 consume su segundo tick
        // Como alcanzó el quantum de 2
        // P1 vuelve a Listo y P2 toma la CPU
        simulador.tick();

        expect(simulador.ejecutando).toBe(p2);
    });

    it("RF07 - Debe respetar el quantum", () => {
        const simulador = new Simulador(1000, 2);
        //quantum = 2
        const p1 = new Proceso("P1", 200, 5);
        const p2 = new Proceso("P2", 200, 5);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        //se ejecutan el primer y segundo tick
        simulador.tick();
        simulador.tick();

        // P1 alcanzó el quantum
        // P1 Listo
        // P2 Ejecutando
        expect(simulador.ejecutando).toBe(p2);

        // Cuando P1 vuelve a la cola de Listos
        // su contador de quantum se reinicia
        expect(p1.quantumConsumido).toBe(0);
    });

     it("RF07 - Debe registrar cambios de contexto", () => {
        const simulador = new Simulador(1000, 2);
        //quatum = 2
        const p1 = new Proceso("P1", 200, 5);
        const p2 = new Proceso("P2", 200, 5);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        // P1 comienza a utilizar la CPU
        simulador.tick();

        // P1 agota el quantum y P2 toma la CPU
        // Esto genera un cambio de contexto
        simulador.tick();
        
        // Esperamos que haya al menos un cambio
        expect(simulador.cambiosContexto).toBeGreaterThan(0);
    });

    it("RF08 - Debe bloquear un proceso por E/S", () => {
        const simulador =new Simulador(1000, 3);
        //quantum = 3
        const proceso =new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);
        simulador.configurarES("P1",2,3);
        // Configura la e/s
        // después de 2 ticks de CPU
        // se bloquea durante 3 ticks

        simulador.tick();
        simulador.tick();

        // Al llegar a 2 ticks de CPU P1 debe bloquearse
        expect(proceso.estado).toBe("Bloqueado");

        // Ademas P1 debe estar dentro de la lista de bloqueados
        expect(simulador.bloqueados).toContain(proceso);
    });

     it("RF08 - Un proceso bloqueado no debe ejecutar CPU", () => {
        const simulador = new Simulador(1000, 3);
        const p1 = new Proceso("P1", 200, 5);
        const p2 = new Proceso("P2", 200, 5);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        // P1 se bloquea despues de 1 tick de CPUdurante 3 tick
        simulador.configurarES( "P1",1,3 );
        
        // P1 ejecuta y luego se bloquea
        simulador.tick();
        
        // Como P1 está bloqueado P2 puede utilizar la CPU
        simulador.tick();

        //P1 debe estar bloqueado y P2 debe estar ejecutando
        expect(p1.estado).toBe("Bloqueado");
        expect(simulador.ejecutando).toBe(p2);
    });


    it("RF08 - Debe devolver el proceso a Listo después de la E/S", () => {
        const simulador = new Simulador(1000, 3);
        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);

        // Se bloquea después de 1 tick durante 2 ticks
        simulador.configurarES("P1",1,2);

        //Primer tick P1 ejecuta
        simulador.tick();

        //Segundo tick P1 se bloquea
        simulador.tick();

        //Primero debe estar bloqueado y despues del tercer tick ya no
        expect(proceso.estado).toBe("Bloqueado");
        simulador.tick();
        expect(proceso.estado).not.toBe("Bloqueado");
    });

        it("RF08 - No debe aceptar E/S de un proceso inexistente", () => {
        const simulador = new Simulador(1000, 2);

        expect(() => simulador.configurarES("P93",2,3)).toThrow();

        //Nunca registramos P93, se espera que configurarES() genere un error
    });


    it("RF09 - Debe calcular el porcentaje de uso de CPU", () => {
        const simulador =  new Simulador(1000, 2);

        //P1 necestia 3 ticks de CPU
        const proceso = new Proceso("P1", 200, 3);

        simulador.registrarProceso(proceso);

        simulador.tick(); //Primer tick CPU ocupada
        simulador.tick(); //Segundo tick CPU ocupada

        //2 ticks de CPU ocupada / 2 ticks totales = 100% de utilización
        expect(simulador.porcentajeUsoCPU()).toBe(100);
    });


    it("RF09 - Debe calcular la memoria ocupada", () => {
        const simulador = new Simulador(1000, 2);

        // P1 ocupa 200
        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);
        simulador.tick();

        // 200 de los 1000 están ocupados
        expect(simulador.memoriaOcupada()).toBe(200);
    });


    it("RF09 - Debe calcular la memoria libre", () => {
        const simulador = new Simulador(1000, 2);
        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);

        simulador.tick();

        // 1000 total - 200 ocupados = 800 libres
        expect(simulador.memoriaLibre()).toBe(800);
    });

    it("RF09 - Debe calcular el porcentaje de memoria ocupada", () => {
        const simulador = new Simulador(1000, 2);

        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);

        simulador.tick();

        // 200 / 1000 * 100 = 20%
        expect(simulador.porcentajeMemoriaOcupada()).toBe(20);
    });

       it("RF09 - Debe obtener el mayor bloque libre", () => {
        const simulador = new Simulador(1000, 2);
        const proceso = new Proceso("P1", 200, 5);

        simulador.registrarProceso(proceso);
        simulador.tick();

        //La memoria queda con P1 que ocupa 200 y el resto libre 800
        expect(simulador.mayorBloqueLibre()).toBe(800);
    });


    it("RF09 - Debe calcular la fragmentación externa", () => {
    const simulador = new Simulador(1000, 2);
    //quantum = 2

    const p1 = new Proceso("P1", 250, 1);
    //// P1 necesita 250 KB y solamente 1 tick de CPU
    // Al terminar va a liberar sus 250 KB

    const p2 = new Proceso("P2", 250, 5);
    // P2 necesita 250 KB y seguira ejecutandose

    const p3 = new Proceso("P3", 250, 5);
    // P3 necesita 250 KB y seguira ejecutandose

    // Registramos los tres procesos en el simulador
    // En este momento quedan esperando que se les asigne memoria
    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);
    simulador.registrarProceso(p3);


    // Avanzamos un tick de la simulacion
    // Se asigna memoria a los tres procesos
    // P1 comienza a ejecutarse y como necesita solo 1 tick
    // termina y libera sus 250 KB
    simulador.tick();

    // Despues de terminar P1 quedan P2 y P3 ocupando memoria
    // 250 KB + 250 KB = 500 KB ocupados
    expect(simulador.memoriaOcupada()).toBe(500);

    // La memoria total es 1000 KB, si hay 500 KB ocupados quedan 500 KB libres
    expect(simulador.memoriaLibre()).toBe(500);

    // La memoria libre esta dividida en dos bloques 
    // [LIBRE 250] [P2 250] [P3 250] [LIBRE 250]
    // Asi que el mayor bloque libre sera de 250
    expect(simulador.mayorBloqueLibre()).toBe(250);

    //Fragmentacion externa = (1 - mayorBloqueLibre / memoriaLibre) * 100
    //(1 - 250 / 500) * 100 = 50%  
    expect(simulador.fragmentacionExterna()).toBe(50);
});

    it("RF10 - Debe exponer el estado actual del sistema", () => {
    const simulador = new Simulador(1000, 2);
    const p1 = new Proceso("P1", 200, 5);
    const p2 = new Proceso("P2", 200, 5);

    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);
    simulador.tick();
    // Despues del primer tick P1 Ejecutando y P2 Listo

    expect(simulador.tickActual).toBe(1); // Se avanzó un tick
    expect(simulador.ejecutando).toBe(p1); // P1 está utilizando la CPU
    expect(simulador.listos).toContain(p2); // P2 está esperando su turno de CPU
    expect(simulador.esperandoMemoria).toHaveLength(0); 
    // los dos consiguieron memoria asi que nadie espera memoria

    expect(simulador.bloqueados).toHaveLength(0);  // Ninguno esta bloqueado por E/S
    expect(simulador.terminados).toHaveLength(0);       // Ninguno termino
    expect(simulador.bloquesMemoria).toHaveLength(3); //La memoria queda dividida en en P1 200 P2 200 y libre 600 
});

it("RF10 - No debe haber más de un proceso ejecutándose", () => {
    const simulador =new Simulador(1000, 2);
    const p1 =new Proceso("P1", 200, 5);
    const p2 =new Proceso("P2", 200, 5);

    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);
    simulador.tick();

    expect(simulador.ejecutando).toBe(p1); // P1 es el unico proceso que esta ejecutando
    expect(p2.estado).not.toBe("Ejecutando"); // P2 no debe estar ejecutando al mismo tiempo
});

it("RF10 - Las vistas del sistema deben proteger el estado interno", () => {
    const simulador = new Simulador(1000, 2);
    const p1 = new Proceso("P1", 200, 5);
    const p2 = new Proceso("P2", 200, 5);

    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);

    simulador.tick();

    const listos =simulador.listos; // Obtenemos una copia de la lista de procesos listos

    listos.splice(0, 1); //Se modifica la copia, desde la pocision 0 elimina 1 elemento

    expect(simulador.listos).toContain(p2); //en la lista interna del simulador P2 deberia estar en listos todavia
});

it("RF10 - No debe haber procesos duplicados en las colas", () => {
    const simulador = new Simulador(1000, 2);
    const p1 = new Proceso("P1", 200, 5);
    const p2 = new Proceso("P2", 200, 5);

    simulador.registrarProceso(p1);
    simulador.registrarProceso(p2);

    // Avanzamos varios ticks para que el simulador ejecute los procesos 
    // y puedan ser planificados para cambiar de cola
    simulador.tick();
    simulador.tick();
    simulador.tick();

    const todos = [ //Juntamos todos los procesos de las diferentes colas
        //para verificar que no haya procesos repetidos en distintas colas
        ...simulador.listos,
        ...simulador.bloqueados,
        ...simulador.terminados
    ];

    const ids =todos.map(proceso => proceso.pid); //se recorren todos los procesos y nos quedamos solamente con su pid
    expect(new Set(ids).size).toBe(ids.length); //set elimina los valores repetidos y se comprueba que no haya ids repetidos
});

   
});