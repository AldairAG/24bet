/**
 * Auth Helpers para 24bet
 * Utilidades para manejo de autenticación
 */

import { UserRole } from '../types/authTypes';

// ========== TOKEN UTILITIES ==========

/**
 * Decodificar JWT token sin verificar firma
 */
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

/**
 * Verificar si el token ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
};

/**
 * Obtener tiempo restante del token en segundos
 */
export const getTokenTimeRemaining = (token: string): number => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, decoded.exp - now);
};

/**
 * Formatear tiempo restante del token
 */
export const formatTokenTimeRemaining = (token: string): string => {
  const seconds = getTokenTimeRemaining(token);
  
  if (seconds === 0) return 'Expirado';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// ========== ROLE UTILITIES ==========

/**
 * Verificar si el usuario tiene un rol específico
 */
export const hasRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  // Admin tiene acceso a todo
  if (userRole === 'ADMIN') return true;
  
  return userRole === requiredRole;
};

/**
 * Verificar si el usuario es administrador
 */
export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'ADMIN';
};

/**
 * Verificar si el usuario es usuario regular
 */
export const isUser = (userRole: UserRole | undefined): boolean => {
  return userRole === 'USER';
};

/**
 * Obtener descripción del rol
 */
export const getRoleDescription = (role: UserRole): string => {
  const descriptions = {
    ADMIN: 'Administrador',
    USER: 'Usuario',
  };
  return descriptions[role] || role;
};

/**
 * Obtener color para el rol
 */
export const getRoleColor = (role: UserRole): string => {
  const colors = {
    ADMIN: '#DC3545', // Rojo
    USER: '#28A745',  // Verde
  };
  return colors[role] || '#6C757D'; // Gris por defecto
};

// ========== PERMISSION UTILITIES ==========

/**
 * Lista de permisos por rol
 */
export const PERMISSIONS = {
  // Permisos de usuario regular
  USER: [
    'profile.read',
    'profile.update',
    'personalInfo.read',
    'personalInfo.update',
    'kyc.read',
    'kyc.upload',
    'kyc.download.own',
    'password.change',
  ],
  // Permisos de administrador (incluye todos los de USER)
  ADMIN: [
    'profile.read',
    'profile.update',
    'personalInfo.read',
    'personalInfo.update',
    'kyc.read',
    'kyc.upload',
    'kyc.download.own',
    'password.change',
    // Permisos adicionales de admin
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
    'users.search',
    'users.stats',
    'kyc.review',
    'kyc.download.any',
    'personalInfo.read.any',
    'personalInfo.update.any',
    'admin.dashboard',
  ],
} as const;

/**
 * Verificar si el usuario tiene un permiso específico
 */
export const hasPermission = (userRole: UserRole | undefined, permission: string): boolean => {
  if (!userRole) return false;
  
  const rolePermissions = PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission as any);
};

/**
 * Obtener todos los permisos del usuario
 */
export const getUserPermissions = (userRole: UserRole | undefined): readonly string[] => {
  if (!userRole) return [];
  return PERMISSIONS[userRole] || [];
};

// ========== VALIDATION UTILITIES ==========

/**
 * Validar formato de email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar formato de username
 */
export const isValidUsername = (username: string): boolean => {
  // Entre 3 y 50 caracteres, solo letras, números y _
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

/**
 * Validar fortaleza de contraseña
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  score: number; // 0-100
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  // Longitud mínima
  if (password.length < 6) {
    feedback.push('Debe tener al menos 6 caracteres');
  } else {
    score += 20;
  }
  
  // Longitud ideal
  if (password.length >= 8) {
    score += 10;
  }
  
  if (password.length >= 12) {
    score += 10;
  }
  
  // Minúsculas
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Debe incluir al menos una letra minúscula');
  }
  
  // Mayúsculas
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Debe incluir al menos una letra mayúscula');
  }
  
  // Números
  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Debe incluir al menos un número');
  }
  
  // Caracteres especiales
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Debe incluir al menos un carácter especial');
  }
  
  return {
    isValid: password.length >= 6 && score >= 60,
    score: Math.min(100, score),
    feedback,
  };
};

/**
 * Generar sugerencia de password seguro
 */
export const generateSecurePassword = (length: number = 12): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Asegurar al menos un carácter de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Completar con caracteres aleatorios
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mezclar la contraseña
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// ========== SESSION UTILITIES ==========

/**
 * Calcular tiempo de sesión activa
 */
export const getSessionDuration = (loginTime: number): string => {
  const now = Date.now();
  const duration = now - loginTime;
  
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Verificar si la sesión debe renovarse pronto
 */
export const shouldRefreshSession = (token: string, thresholdMinutes: number = 15): boolean => {
  const remainingSeconds = getTokenTimeRemaining(token);
  const thresholdSeconds = thresholdMinutes * 60;
  
  return remainingSeconds > 0 && remainingSeconds < thresholdSeconds;
};

// ========== EXPORT ALL ==========
export {
  // Re-export types for convenience
  type UserRole,
} from '../types/authTypes';
