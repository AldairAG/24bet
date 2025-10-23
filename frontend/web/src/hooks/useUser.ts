import { useSelector, useDispatch } from "react-redux";
import type { EditUserProfile } from "../types/userTypes";
import type { RootState } from "../store";
import { usuarioService } from "../service/usuarioService";
import { setUsuario } from "../store/slices/authSlice";

export const useUser = () => {
    const user = useSelector((state: RootState) => state.auth.usuario);
    const dispatch = useDispatch();

    const editarPerfil = async (data: EditUserProfile) => {
        const response = await usuarioService.editarPerfil(data,user!.id);
        dispatch(setUsuario(response.data));
    };

    return {
        user,
        editarPerfil
    };

};