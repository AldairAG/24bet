import { Usuario } from "./authTypes";

export interface EditUserProfile extends Omit<Usuario, 'id' | 'activo' | 'fechaCreacion' | 'fechaActualizacion' | 'rol' | 'saldoUsd' | 'documentosKyc' | 'fechaNacimiento' > {
}