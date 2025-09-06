import { useSelector, useDispatch } from "react-redux";
import { EditUserProfile } from "../types/userTypes";
import { RootState } from "../store";
import {usuarioService} from '../service/usuarioService';
import { setUsuario } from "../store/slices/authSlice";

export const useUser = () => {
    const user = useSelector((state: RootState) => state.auth.usuario);
    const dispatch = useDispatch();

    const editarPerfil = async (data: EditUserProfile) => {
        const response = await usuarioService.editarPerfil(data);
        dispatch(setUsuario(response.data));
    };

    return {
        user,
        editarPerfil
    };

};