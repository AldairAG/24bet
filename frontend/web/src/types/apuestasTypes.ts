export interface CrearApuesta {
    id: number;
    eventoId: number;
    monto: number;
    odd: number;
    tipoApuesta: string;
}

export interface ApuestaEnBoleto extends CrearApuesta {
    eventoName: string;
    descripcion: string;
    validaParaParlay: boolean;
}

export interface CrearParlayApuestas {
    apuestas: CrearApuesta[];
    montoApostar: number;
}

export interface ApuestaHistorialResponse {
    tipoApuesta: string;
    montoApostado: number;
    resultado: boolean;
    fechaApuesta: string;
    nombreEvento: string;
    resultadoEvento: string;
    resultadoApostado: string;
    estadoApuesta: string;
    momio: number;
    descripcionResultado?: string;
}