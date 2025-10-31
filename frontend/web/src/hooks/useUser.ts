import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import type { EditUserProfile, EditarUsuarioAdminRequest } from "../types/userTypes";
import type { RootState, AppDispatch } from "../store";
import { usuarioService } from "../service/usuarioService";
import { setUsuario } from "../store/slices/authSlice";
import {
    userAdminThunks,
    selectUsuarios,
    selectUsuariosPagination,
    selectUsuariosLoading,
    selectUsuariosError,
    selectUsuarioActual,
    selectUsuarioActualLoading,
    selectUsuarioActualError,
    selectUsuarioAdminUpdating,
    selectUsuarioAdminDeactivating,
        selectUsuarioAdminActivating,
} from "../store/slices/userSlice";

export const useUser = () => {
    const user = useSelector((state: RootState) => state.auth.usuario);
    const dispatch = useDispatch<AppDispatch>();

    // State ADMIN
    const usuarios = useSelector(selectUsuarios);
    const usuariosPagination = useSelector(selectUsuariosPagination);
    const isLoadingUsuarios = useSelector(selectUsuariosLoading);
    const loadUsuariosError = useSelector(selectUsuariosError);

    const usuarioActual = useSelector(selectUsuarioActual);
    const isLoadingUsuarioActual = useSelector(selectUsuarioActualLoading);
    const loadUsuarioActualError = useSelector(selectUsuarioActualError);

    const isUpdatingUsuarioAdmin = useSelector(selectUsuarioAdminUpdating);
    const isDeactivatingUsuario = useSelector(selectUsuarioAdminDeactivating);
    const isActivatingUsuario = useSelector(selectUsuarioAdminActivating);

    const editarPerfil = async (data: EditUserProfile) => {
        const response = await usuarioService.editarPerfil(data,user!.id);
        dispatch(setUsuario(response.data));
    };

    // Acciones ADMIN
    const listarUsuarios = useCallback(async (page = 0, size = 10) => {
        await dispatch(userAdminThunks.listarUsuariosThunk({ page, size }));
    }, [dispatch]);

    const obtenerUsuarioPorId = useCallback(async (id: number) => {
        await dispatch(userAdminThunks.obtenerUsuarioPorIdThunk(id));
    }, [dispatch]);

    const editarUsuarioComoAdmin = useCallback(async (id: number, datos: EditarUsuarioAdminRequest) => {
        await dispatch(userAdminThunks.editarUsuarioComoAdminThunk({ id, datos }));
    }, [dispatch]);

    const desactivarUsuario = useCallback(async (id: number) => {
        await dispatch(userAdminThunks.desactivarUsuarioThunk(id));
    }, [dispatch]);

    const activarUsuario = useCallback(async (id: number) => {
        await dispatch(userAdminThunks.activarUsuarioThunk(id));
    }, [dispatch]);

    return {
        // usuario autenticado
        user,
        editarPerfil,

        // ADMIN state
        usuarios,
        usuariosPagination,
        isLoadingUsuarios,
        loadUsuariosError,
        usuarioActual,
        isLoadingUsuarioActual,
        loadUsuarioActualError,
        isUpdatingUsuarioAdmin,
        isDeactivatingUsuario,
    isActivatingUsuario,

        // ADMIN actions
        listarUsuarios,
        obtenerUsuarioPorId,
        editarUsuarioComoAdmin,
        desactivarUsuario,
        activarUsuario,
    };

};