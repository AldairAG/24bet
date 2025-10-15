
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../service/authService';
//import { getExchangeRates } from '../../service/crypto/cryptoService';
import type{
	LoginRequest,
	RegistroRequest,
	JwtResponse,
	UsuarioResponse,
	Usuario,
	ApiResponseWrapper
} from '../../types/authTypes';

// Utility functions para sessionStorage
const saveToSessionStorage = (key: string, value: unknown) => {
	try {
		if (typeof window !== 'undefined' && window.sessionStorage) {
			sessionStorage.setItem(key, JSON.stringify(value));
		}
	} catch (error) {
		console.error('Error saving to sessionStorage:', error);
	}
};

const loadFromSessionStorage = (key: string) => {
	try {
		if (typeof window !== 'undefined' && window.sessionStorage) {
			const item = sessionStorage.getItem(key);
			return item ? JSON.parse(item) : null;
		}
		return null;
	} catch (error) {
		console.error('Error loading from sessionStorage:', error);
		return null;
	}
};

const removeFromSessionStorage = (key: string) => {
	try {
		if (typeof window !== 'undefined' && window.sessionStorage) {
			sessionStorage.removeItem(key);
		}
	} catch (error) {
		console.error('Error removing from sessionStorage:', error);
	}
};

interface AuthState {
	user: Usuario | null;
	token: string | null;
	loading: boolean;
	error: string | null;
	isAuthenticated: boolean;
}

// Cargar estado inicial desde sessionStorage
const loadInitialState = (): AuthState => {
	const savedUser = loadFromSessionStorage('auth_user');
	const savedToken = loadFromSessionStorage('auth_token');
	
	return {
		user: savedUser,
		token: savedToken,
		loading: false,
		error: null,
		isAuthenticated: !!(savedUser && savedToken),
	};
};

const initialState: AuthState = loadInitialState();

export const registro = createAsyncThunk<
	ApiResponseWrapper<UsuarioResponse>,
	RegistroRequest,
	{ rejectValue: string }
>(
	'auth/registro',
	async (registroRequest, { rejectWithValue }) => {
		try {
			const response = await authService.registro(registroRequest);
			if (!response.success) {
				return rejectWithValue(response.message);
			}
			return response;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
			return rejectWithValue(errorMessage);
		}
	}
);

export const login = createAsyncThunk<
	ApiResponseWrapper<JwtResponse>,
	LoginRequest,
	{ rejectValue: string }
>(
	'auth/login',
	async (loginRequest, { rejectWithValue }) => {
		try {
			const response = await authService.login(loginRequest);
			if (!response.success) {
				return rejectWithValue(response.message);
			}
			return response;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : 'Error en el login';
			return rejectWithValue(errorMessage);
		}
	}
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout(state) {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			state.error = null;
			// Limpiar sessionStorage
			removeFromSessionStorage('auth_user');
			removeFromSessionStorage('auth_token');
		},
		setUser(state, action: PayloadAction<Usuario>) {
			state.user = action.payload;
			state.isAuthenticated = true;
			// Guardar en sessionStorage
			saveToSessionStorage('auth_user', action.payload);
		},
		setToken(state, action: PayloadAction<string>) {
			state.token = action.payload;
			// Guardar en sessionStorage
			saveToSessionStorage('auth_token', action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registro.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registro.fulfilled, (state, action) => {
				state.loading = false;
				// Para el registro, convertimos UsuarioResponse a Usuario básico
				const userData = action.payload.data;
				const user = {
					id: userData.id,
					username: userData.username,
					email: userData.email,
					nombre: userData.nombre,
					apellido: userData.apellido,
					ladaTelefono: userData.ladaTelefono,
					numeroTelefono: userData.numeroTelefono,
					fechaNacimiento: new Date(userData.fechaNacimiento),
					activo: true, // Asumimos que el usuario registrado está activo
					fechaCreacion: new Date().toISOString(),
					fechaActualizacion: new Date().toISOString(),
					rol: 'USER', // Rol por defecto para usuarios registrados
					informacionPersonal: {} as Usuario['informacionPersonal'], // Placeholder tipado
					documentosKyc: [] // Array vacío inicial
				};
				state.user = user;
				state.isAuthenticated = true;
				state.error = null;
				// Guardar en sessionStorage
				saveToSessionStorage('auth_user', user);
			})
			.addCase(registro.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Error en el registro';
			})
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.token = action.payload.data.token;
				state.user = action.payload.data.user;
				state.isAuthenticated = true;
				state.error = null;
				// Guardar en sessionStorage
				saveToSessionStorage('auth_token', action.payload.data.token);
				saveToSessionStorage('auth_user', action.payload.data.user);
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Error en el login';
			});
	},
});

export const { logout, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
