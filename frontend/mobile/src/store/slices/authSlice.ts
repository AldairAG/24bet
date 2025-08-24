
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../service/authService';
import {
	LoginRequest,
	RegistroRequest,
	JwtResponse,
	UsuarioResponse,
	ApiResponseWrapper
} from '../../types/authTypes';

interface AuthState {
	user: UsuarioResponse | null;
	token: string | null;
	loading: boolean;
	error: string | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	user: null,
	token: null,
	loading: false,
	error: null,
	isAuthenticated: false,
};

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
		} catch (error: any) {
			return rejectWithValue(error?.response?.data?.message || 'Error en el registro');
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
		} catch (error: any) {
			return rejectWithValue(error?.response?.data?.message || 'Error en el login');
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
		},
		setUser(state, action: PayloadAction<UsuarioResponse>) {
			state.user = action.payload;
			state.isAuthenticated = true;
		},
		setToken(state, action: PayloadAction<string>) {
			state.token = action.payload;
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
				state.user = action.payload.data;
				state.isAuthenticated = true;
				state.error = null;
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
				state.isAuthenticated = true;
				state.error = null;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Error en el login';
			});
	},
});

export const { logout, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
