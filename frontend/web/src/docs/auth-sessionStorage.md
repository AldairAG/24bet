# 🔐 Sistema de Autenticación con SessionStorage

## 📋 Resumen de Cambios

Se ha actualizado el sistema de autenticación para usar **sessionStorage** en lugar de localStorage, proporcionando mejor seguridad y sincronización entre Redux y las llamadas a la API.

## 🔧 Componentes Actualizados

### 1. **AuthSlice (`authSlice.ts`)**
- ✅ Persiste automáticamente el estado en `sessionStorage`
- ✅ Carga el estado inicial desde `sessionStorage` al arrancar
- ✅ Limpia `sessionStorage` al hacer logout
- ✅ Usa claves consistentes: `auth_user` y `auth_token`

### 2. **ApiBase (`apiBase.ts`)**
- ✅ Cambiado de localStorage a sessionStorage
- ✅ Sincronización automática con Redux
- ✅ Limpieza automática en errores 401
- ✅ Usa las mismas claves que authSlice

### 3. **Store (`index.ts`)**
- ✅ Inicializa el token en apiBase al cargar
- ✅ Se suscribe a cambios de autenticación para mantener sincronización

### 4. **Hook useAuth (`useAuth.ts`)**
- ✅ Funciones mejoradas con sincronización automática
- ✅ Manejo de errores centralizado
- ✅ API más limpia y fácil de usar

## 🚀 Cómo Usar

### Login
```typescript
import { useAuth } from '../hooks/useAuth';

const LoginComponent = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials);
      if (login.fulfilled.match(result)) {
        // Login exitoso - token automáticamente sincronizado
        console.log('Login exitoso:', result.payload);
      }
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  return (
    // Tu JSX aquí
  );
};
```

### Logout
```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout(); // Limpia Redux, sessionStorage y apiBase automáticamente
};
```

### Verificar Autenticación
```typescript
const { isAuthenticated, user, token } = useAuth();

if (isAuthenticated) {
  // Usuario autenticado
  console.log('Usuario:', user);
} else {
  // Redirigir a login
}
```

### Hacer Llamadas API
```typescript
import { api } from '../service/apiBase';

// Las llamadas API automáticamente incluyen el token
const fetchUserData = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    // Si el token es inválido, se limpia automáticamente
    console.error('Error:', error);
  }
};
```

## 🔑 Claves de SessionStorage

- `auth_user`: Almacena la información del usuario
- `auth_token`: Almacena el JWT token

## ✨ Beneficios

1. **Seguridad**: SessionStorage se limpia al cerrar el navegador
2. **Sincronización**: Redux, sessionStorage y apiBase siempre están sincronizados
3. **Automatización**: No necesitas manejar tokens manualmente
4. **Limpieza**: Logout automático en errores 401
5. **Persistencia**: El estado se mantiene al recargar la página

## 🛡️ Manejo de Errores

- **401 Unauthorized**: Limpia automáticamente la sesión y redirige
- **Token Expirado**: Detección automática y limpieza
- **Errores de Red**: Preserva el estado local hasta que se resuelva

## 🔄 Flujo de Autenticación

1. **Login**: Usuario → Redux → SessionStorage → ApiBase
2. **API Calls**: ApiBase lee token desde Redux/SessionStorage
3. **Error 401**: ApiBase limpia Redux → SessionStorage → Headers
4. **Logout**: Redux → SessionStorage → ApiBase (todo limpio)
5. **Reload**: SessionStorage → Redux → ApiBase (estado restaurado)

## 💡 Mejores Prácticas

1. Usa siempre el hook `useAuth` para operaciones de autenticación
2. Las llamadas API automáticamente manejan el token
3. No manipules sessionStorage directamente
4. Confía en la sincronización automática entre componentes