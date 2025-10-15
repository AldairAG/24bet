import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { type RootState } from '../store';
import {
	registro,
	login,
	logout,
	setUser,
	setToken
} from '../store/slices/authSlice';
import type{
	LoginRequest,
	RegistroRequest,
	Usuario
} from '../types/authTypes';
import { type AppDispatch } from '../store';
import { apiBase } from '../service/apiBase';

export const useAuth = () => {
	const dispatch = useDispatch<AppDispatch>();
	const auth = useSelector((state: RootState) => state.auth);

	// Login con sincronización de apiBase
	const handleLogin = useCallback(async (data: LoginRequest) => {
		const result = await dispatch(login(data));
		
		// Si el login es exitoso, sincronizar el token con apiBase
		if (login.fulfilled.match(result)) {
			apiBase.syncTokenFromRedux();
		}
		
		return result;
	}, [dispatch]);

	// Logout con limpieza de apiBase
	const handleLogout = useCallback(async () => {
		dispatch(logout());
		await apiBase.clearAuthToken();
	}, [dispatch]);

	// Registro
	const handleRegistro = useCallback((data: RegistroRequest) => {
		return dispatch(registro(data));
	}, [dispatch]);

	// Set user
	const handleSetUser = useCallback((user: Usuario) => {
		return dispatch(setUser(user));
	}, [dispatch]);

	// Set token con sincronización de apiBase
	const handleSetToken = useCallback(async (token: string) => {
		dispatch(setToken(token));
		await apiBase.setAuthToken(token);
	}, [dispatch]);

	// Verificar si el usuario está autenticado
	const isAuthenticated = auth.isAuthenticated && !!auth.token;

	return {
		...auth,
		isAuthenticated,
		registro: handleRegistro,
		login: handleLogin,
		logout: handleLogout,
		setUser: handleSetUser,
		setToken: handleSetToken,
	};
};
