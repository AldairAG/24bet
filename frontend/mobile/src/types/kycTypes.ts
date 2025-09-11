export interface InformacionPersonal {
    id: number;

    // ========== INFORMACIÓN BÁSICA ==========

    genero: Genero;

    // ========== DIRECCIÓN ==========

    calle: string;

    numeroExterior: string;

    numeroInterior: string;

    colonia: string;

    codigoPostal: string;

    ciudad: string;

    estado: string;

    pais: string;

    // ========== INFORMACIÓN FISCAL ==========

    rfc: string;

    // ========== INFORMACIÓN ADICIONAL ==========

    ocupacion: string;

    nacionalidad: string;

    // ========== METADATOS ==========
    fechaCreacion: Date;

    fechaActualizacion: Date;
}

export enum Genero {
    MASCULINO = "Masculino",
    FEMENINO = "Femenino",
    OTRO = "Otro",
    NO_ESPECIFICADO = "No Especificado"
}

export interface DocumentoKyc {
    id: number;

    // ========== INFORMACIÓN DEL DOCUMENTO ==========
    
    tipoDocumento: TipoDocumento;
    
    nombreArchivo: string;
    
    rutaArchivo: string;
    tipoMime: string;
    tamañoArchivo: number;

    // ========== ESTADO Y VERIFICACIÓN ==========
    
    estado: EstadoDocumento;
    motivoRechazo: string;
    observaciones: string;

    // ========== INFORMACIÓN DE AUDITORÍA ==========
    fechaSubida: Date;
    fechaRevision: Date;

    // ========== METADATOS ==========
    version: number;
    activo: boolean;
}

export enum TipoDocumento {
    INE = "INE",
    COMPROBANTE_DOMICILIO = "COMPROBANTE_DOMICILIO"
}

export enum EstadoDocumento {
        PENDIENTE = "Pendiente de revisión",
        APROBADO = "Aprobado",
        DENEGADO = "Denegado",
        RESUBMITIR = "Requiere reenvío"
}