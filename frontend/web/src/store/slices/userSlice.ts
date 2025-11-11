import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { usuarioService } from "../../service/usuarioService";
import type { EditarUsuarioAdminRequest, PageResponse, ResumenTransacciones } from "../../types/userTypes";
import type { UsuarioResponse } from "../../types/authTypes";

// Estado para funcionalidades de ADMIN sobre usuarios
interface UserState {
    usuarios: UsuarioResponse[];
    pagination: {
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
        first: boolean;
        last: boolean;
    } | null;
    isLoadingUsuarios: boolean;
    loadUsuariosError: string | null;

    usuarioActual: UsuarioResponse | null;
    isLoadingUsuarioActual: boolean;
    loadUsuarioActualError: string | null;

    // acciones admin
    isUpdatingUsuarioAdmin: boolean;
    updateUsuarioAdminError: string | null;

    isDeactivatingUsuario: boolean;
    deactivateUsuarioError: string | null;

    isActivatingUsuario: boolean;
    activateUsuarioError: string | null;

    // Mantener compatibilidad con estados existentes
    resumenTransacciones: ResumenTransacciones | null;
    isLoadingResumenTransacciones: boolean;
    loadResumenTransaccionesError: string | null;
}

const initialState: UserState = {
    usuarios: [],
    pagination: null,
    isLoadingUsuarios: false,
    loadUsuariosError: null,

    usuarioActual: null,
    isLoadingUsuarioActual: false,
    loadUsuarioActualError: null,

    isUpdatingUsuarioAdmin: false,
    updateUsuarioAdminError: null,

    isDeactivatingUsuario: false,
    deactivateUsuarioError: null,

    isActivatingUsuario: false,
    activateUsuarioError: null,

    resumenTransacciones: null,
    isLoadingResumenTransacciones: false,
    loadResumenTransaccionesError: null,
};

// Thunks ADMIN
export const listarUsuariosThunk = createAsyncThunk<
    PageResponse<UsuarioResponse>,
    { page?: number; size?: number }
>("user/listarUsuarios", async ({ page = 0, size = 10 }) => {
    const resp = await usuarioService.admin.listarUsuarios(page, size);
    return resp.data;
});

export const obtenerUsuarioPorIdThunk = createAsyncThunk<
    UsuarioResponse,
    number
>("user/obtenerUsuarioPorId", async (id: number) => {
    const resp = await usuarioService.admin.obtenerUsuarioPorId(id);
    return resp.data;
});

export const editarUsuarioComoAdminThunk = createAsyncThunk<
    UsuarioResponse,
    { id: number; datos: EditarUsuarioAdminRequest }
>("user/editarUsuarioComoAdmin", async ({ id, datos }) => {
    const resp = await usuarioService.admin.editarUsuarioComoAdmin(id, datos);
    return resp.data;
});

export const desactivarUsuarioThunk = createAsyncThunk<
    { id: number },
    number
>("user/desactivarUsuario", async (id: number) => {
    await usuarioService.admin.desactivarUsuario(id);
    return { id };
});

export const activarUsuarioThunk = createAsyncThunk<
    { id: number },
    number
>("user/activarUsuario", async (id: number) => {
    await usuarioService.admin.activarUsuario(id);
    return { id };
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Listar
        builder
            .addCase(listarUsuariosThunk.pending, (state) => {
                state.isLoadingUsuarios = true;
                state.loadUsuariosError = null;
            })
            .addCase(
                listarUsuariosThunk.fulfilled,
                (state, action: PayloadAction<PageResponse<UsuarioResponse>>) => {
                    state.isLoadingUsuarios = false;
                    state.usuarios = action.payload.content;
                    state.pagination = {
                        totalElements: action.payload.totalElements,
                        totalPages: action.payload.totalPages,
                        size: action.payload.size,
                        number: action.payload.number,
                        first: action.payload.first,
                        last: action.payload.last,
                    };
                }
            )
            .addCase(listarUsuariosThunk.rejected, (state, action) => {
                state.isLoadingUsuarios = false;
                state.loadUsuariosError = action.error.message ?? "Error al listar usuarios";
            });

        // Obtener por ID
        builder
            .addCase(obtenerUsuarioPorIdThunk.pending, (state) => {
                state.isLoadingUsuarioActual = true;
                state.loadUsuarioActualError = null;
            })
            .addCase(
                obtenerUsuarioPorIdThunk.fulfilled,
                (state, action: PayloadAction<UsuarioResponse>) => {
                    state.isLoadingUsuarioActual = false;
                    state.usuarioActual = action.payload;
                }
            )
            .addCase(obtenerUsuarioPorIdThunk.rejected, (state, action) => {
                state.isLoadingUsuarioActual = false;
                state.loadUsuarioActualError = action.error.message ?? "Error al obtener usuario";
            });

        // Editar como ADMIN
        builder
            .addCase(editarUsuarioComoAdminThunk.pending, (state) => {
                state.isUpdatingUsuarioAdmin = true;
                state.updateUsuarioAdminError = null;
            })
            .addCase(
                editarUsuarioComoAdminThunk.fulfilled,
                (state, action: PayloadAction<UsuarioResponse>) => {
                    state.isUpdatingUsuarioAdmin = false;
                    state.usuarioActual = action.payload;
                    state.usuarios = state.usuarios.map((u) =>
                        u.id === action.payload.id ? action.payload : u
                    );
                }
            )
            .addCase(editarUsuarioComoAdminThunk.rejected, (state, action) => {
                state.isUpdatingUsuarioAdmin = false;
                state.updateUsuarioAdminError = action.error.message ?? "Error al actualizar usuario";
            });

        // Desactivar usuario
        builder
            .addCase(desactivarUsuarioThunk.pending, (state) => {
                state.isDeactivatingUsuario = true;
                state.deactivateUsuarioError = null;
            })
            .addCase(
                desactivarUsuarioThunk.fulfilled,
                (state, action: PayloadAction<{ id: number }>) => {
                    state.isDeactivatingUsuario = false;
                    // Reflejar en usuarioActual
                    if (state.usuarioActual && state.usuarioActual.id === action.payload.id) {
                        state.usuarioActual.activo = false;
                    }
                    // Reflejar en la lista si existe la propiedad
                    state.usuarios = state.usuarios.map((u) => {
                        if (u.id !== action.payload.id) return u;
                        return { ...u, ...("activo" in u ? { activo: false } : {}) } as UsuarioResponse;
                    });
                }
            )
            .addCase(desactivarUsuarioThunk.rejected, (state, action) => {
                state.isDeactivatingUsuario = false;
                state.deactivateUsuarioError = action.error.message ?? "Error al desactivar usuario";
            });

                // Activar usuario
                builder
                    .addCase(activarUsuarioThunk.pending, (state) => {
                        state.isActivatingUsuario = true;
                        state.activateUsuarioError = null;
                    })
                    .addCase(
                        activarUsuarioThunk.fulfilled,
                        (state, action: PayloadAction<{ id: number }>) => {
                            state.isActivatingUsuario = false;
                            if (state.usuarioActual && state.usuarioActual.id === action.payload.id) {
                                state.usuarioActual.activo = true;
                            }
                            state.usuarios = state.usuarios.map((u) => {
                                if (u.id !== action.payload.id) return u;
                                return { ...u, ...("activo" in u ? { activo: true } : {}) } as UsuarioResponse;
                            });
                        }
                    )
                    .addCase(activarUsuarioThunk.rejected, (state, action) => {
                        state.isActivatingUsuario = false;
                        state.activateUsuarioError = action.error.message ?? "Error al activar usuario";
                    });
    },
});

// Reducer
export default userSlice.reducer;

// Selectores
export const selectUsuarios = (state: RootState) => state.user.usuarios;
export const selectUsuariosPagination = (state: RootState) => state.user.pagination;
export const selectUsuariosLoading = (state: RootState) => state.user.isLoadingUsuarios;
export const selectUsuariosError = (state: RootState) => state.user.loadUsuariosError;

export const selectUsuarioActual = (state: RootState) => state.user.usuarioActual;
export const selectUsuarioActualLoading = (state: RootState) => state.user.isLoadingUsuarioActual;
export const selectUsuarioActualError = (state: RootState) => state.user.loadUsuarioActualError;

export const selectUsuarioAdminUpdating = (state: RootState) => state.user.isUpdatingUsuarioAdmin;
export const selectUsuarioAdminDeactivating = (state: RootState) => state.user.isDeactivatingUsuario;
export const selectUsuarioAdminActivating = (state: RootState) => state.user.isActivatingUsuario;

// Export thunks agrupados para conveniencia
export const userAdminThunks = {
    listarUsuariosThunk,
    obtenerUsuarioPorIdThunk,
    editarUsuarioComoAdminThunk,
    desactivarUsuarioThunk,
    activarUsuarioThunk,
};