import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
	registro,
	login,
	logout,
	setUser,
	setToken
} from '../store/slices/authSlice';
import {
	LoginRequest,
	RegistroRequest,
	UsuarioResponse
} from '../types/authTypes';
import { AppDispatch } from '../store';
import { apiBase } from '../service/apiBase';
import { useCallback } from 'react';

export const useAuth = () => {
	const dispatch = useDispatch<AppDispatch>();
	const auth = useSelector((state: RootState) => state.auth);

	const handleRegistro = (data: RegistroRequest) => dispatch(registro(data));
	const handleLogin = (data: LoginRequest) => dispatch(login(data));
	const handleLogout = () => dispatch(logout());
	const handleSetUser = (user: UsuarioResponse) => dispatch(setUser(user));
	const handleSetToken = (token: string) => dispatch(setToken(token));

	return {
		...auth,
		registro: handleRegistro,
		login: handleLogin,
		logout: handleLogout,
		setUser: handleSetUser,
		setToken: handleSetToken,
	};
};
