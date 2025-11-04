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




