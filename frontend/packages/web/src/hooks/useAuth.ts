import type { AppDispatch } from "@24bet/shared/dist/store/store";
import { checkAuthAsync, loginAsync, 
    logoutAsync, registerAsync, selectAuth, 
    selectAuthError, selectAuthLoading, selectCurrentUser, 
    selectIsAdmin, selectIsAuthenticated, selectUserRole } from "@24bet/shared/src/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { LoginRequest, RegistroRequest } from "shared";
export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector(selectAuth);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);
    const authLoading = useSelector(selectAuthLoading);
    const authError = useSelector(selectAuthError);
    const userRole = useSelector(selectUserRole);
    const isAdmin = useSelector(selectIsAdmin);

    const login = (credentials: LoginRequest) => {
        dispatch(loginAsync(credentials));
    };

    const register = (userData: RegistroRequest) => {
        dispatch(registerAsync(userData));
    };

    const logout = () => {
        dispatch(logoutAsync());
    };

    const checkAuth = () => {
        dispatch(checkAuthAsync());
    };

    return {
        auth,
        isAuthenticated,
        currentUser,
        authLoading,
        authError,
        userRole,
        isAdmin,
        login,
        register,
        logout,
        checkAuth,
    };
};
