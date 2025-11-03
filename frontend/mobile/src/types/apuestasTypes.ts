export interface CrearApuesta {
    id: number;
    eventoId: number;
    monto: number;
    odd: number;
    tipoApuesta: string;
    idOddValue: number;
}

export interface ApuestaEnBoleto extends CrearApuesta {
    eventoName: string;
    descripcion: string;
}


