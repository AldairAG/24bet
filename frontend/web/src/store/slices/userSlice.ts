import type { ResumenTransacciones, usuarioAdminResponse } from "../../types/userTypes";

interface userState {
    usuarios: usuarioAdminResponse[];
    isLoadingUsuarios: boolean;
    loadUsuariosError: string | null;

    usuarioActual: usuarioAdminResponse | null;
    isLoadingUsuarioActual: boolean;
    loadUsuarioActualError: string | null;

    resumenTransacciones: ResumenTransacciones | null;
    isLoadingResumenTransacciones: boolean;
    loadResumenTransaccionesError: string | null;
}