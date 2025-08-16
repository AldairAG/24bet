# 24bet Web Application

Una interfaz web completa construida con React, TypeScript y Tailwind CSS para la plataforma de apuestas 24bet.

## 🚀 Características

### Tecnologías Principales
- **React 19.1.1** - Framework frontend con TypeScript
- **Tailwind CSS 4.1.11** - Framework CSS utilitario con soporte para tema oscuro/claro
- **Formik + Yup** - Gestión y validación de formularios
- **React Router DOM** - Enrutamiento del lado del cliente con rutas protegidas
- **Framer Motion** - Biblioteca de animaciones
- **React Toastify** - Sistema de notificaciones toast
- **Redux Toolkit** - Gestión de estado integrada con el paquete compartido

### Funcionalidades Implementadas

#### 🎨 Tema y Diseño
- Modo oscuro/claro con hook personalizado `useTheme`
- Esquema de colores rojo y blanco principal
- Diseño completamente responsivo
- Animaciones fluidas con Framer Motion

#### 🔐 Autenticación
- Formularios de Login y Registro con validación completa
- Rutas protegidas con componente AuthGuard
- Integración con hooks de autenticación del paquete compartido

#### 📊 Dashboard de Usuario
- Panel principal con estadísticas
- Estado de verificación KYC
- Acciones rápidas de navegación
- Cards animadas con información relevante

#### 👤 Gestión de Perfil
- Información personal completa con validación
- Cambio de contraseña con confirmación
- Formularios multi-sección organizados

#### 📋 Proceso KYC
- Estados de verificación (No iniciado, En proceso, Completado)
- Subida de documentos con drag-and-drop
- Barra de progreso de verificación
- Validación de tipos de archivo

#### 🛡️ Panel Administrativo
- Dashboard de administración con estadísticas
- Gestión de usuarios con filtros avanzados
- Revisión de documentos KYC
- Sistema de aprobación/rechazo de documentos

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── AuthGuard.tsx    # Protección de rutas
│   ├── Footer.tsx       # Footer de la aplicación
│   ├── Layout.tsx       # Layout principal
│   └── Navbar.tsx       # Barra de navegación
├── hooks/               # Hooks personalizados
│   └── useTheme.ts      # Hook para tema oscuro/claro
├── pages/               # Páginas principales
│   ├── Admin/           # Panel administrativo
│   │   ├── AdminPanel.tsx
│   │   ├── DocumentReview.tsx
│   │   └── UserManagement.tsx
│   ├── Auth/            # Autenticación
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── KYC/             # Verificación KYC
│   │   ├── KycDocuments.tsx
│   │   ├── KycStatus.tsx
│   │   └── UploadDocument.tsx
│   ├── Profile/         # Perfil de usuario
│   │   ├── ChangePassword.tsx
│   │   ├── PersonalInfo.tsx
│   │   └── Profile.tsx
│   ├── Dashboard.tsx    # Dashboard principal
│   └── Home.tsx         # Página de inicio
├── router/              # Configuración de rutas
│   └── index.ts         # Rutas principales
├── App.tsx              # Componente principal
└── main.tsx            # Punto de entrada
```

## 🛠️ Configuración de Desarrollo

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

### Construcción
```bash
npm run build
```

## 🔧 Características Técnicas

### Formularios con Formik
Todos los formularios utilizan Formik para una gestión robusta:
- Validación con esquemas Yup
- Manejo de errores personalizado
- Estados de carga y envío
- Validación en tiempo real

### Sistema de Rutas
- Rutas públicas: Home, Login, Register
- Rutas protegidas: Dashboard, Profile, KYC
- Rutas de administración: Panel Admin, Gestión de Usuarios, Revisión de Documentos

### Notificaciones
Sistema completo de notificaciones con React Toastify:
- Notificaciones de éxito, error, información y advertencia
- Posicionamiento personalizado
- Tema adaptativo (claro/oscuro)

### Animaciones
Animaciones sutiles y profesionales con Framer Motion:
- Transiciones de página
- Animaciones de entrada
- Hover effects
- Animaciones de carga

## 🎯 Integración con Backend

La aplicación está preparada para integración con:
- Hooks del paquete compartido (`useAuth`, `useUser`, `useKyc`)
- API REST para todas las operaciones CRUD
- Sistema de autenticación JWT
- Manejo de estados de carga y error

## 🔒 Seguridad

- Validación tanto en cliente como servidor
- Rutas protegidas por roles
- Sanitización de entradas
- Manejo seguro de archivos

## 📱 Responsividad

Diseño completamente adaptable:
- Mobile-first approach
- Breakpoints de Tailwind CSS
- Componentes flexibles
- Navegación adaptativa

## 🌙 Tema Oscuro/Claro

Hook personalizado `useTheme` que proporciona:
- Detección automática de preferencia del sistema
- Persistencia en localStorage
- Alternancia manual
- Clases CSS dinámicas

## 📋 Estado Actual

### ✅ Completado
- Estructura completa de la aplicación
- Todos los componentes principales implementados
- Sistema de rutas funcional
- Tema oscuro/claro
- Formularios con validación
- Diseño responsivo
- Animaciones

### 🚧 Pendiente
- Conexión real con APIs del backend
- Reemplazo de datos simulados con hooks reales
- Optimización de tipos TypeScript
- Testing unitario
- Documentación de componentes

## 🎨 Guía de Estilo

### Colores Principales
- Rojo: `red-600` (primario), `red-700` (hover)
- Blanco: `white` (backgrounds claros)
- Grises: Paleta completa para texto y fondos
- Estados: Verde (éxito), Amarillo (advertencia), Rojo (error)

### Tipografía
- Font family: Sistema predeterminado de Tailwind
- Escalas: `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.
- Pesos: `font-medium`, `font-semibold`, `font-bold`

### Espaciado
- Padding: `px-4`, `py-2`, `p-6`, etc.
- Margins: `mb-4`, `mt-8`, `mx-auto`, etc.
- Gaps: `space-x-4`, `gap-6`, etc.

Esta aplicación web proporciona una base sólida y profesional para la plataforma 24bet, con todas las funcionalidades principales implementadas y lista para integración con el backend.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
