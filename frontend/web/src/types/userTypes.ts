import type { Usuario } from "./authTypes";

export type EditUserProfile = Omit<Usuario, 'id' | 'activo' | 'fechaCreacion' | 'fechaActualizacion' | 'rol' | 'saldoUsd' | 'documentosKyc' | 'fechaNacimiento' >