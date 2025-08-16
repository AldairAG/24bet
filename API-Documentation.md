# 📚 Documentación de API - 24bet Backend

## 🔗 Base URL
```
http://localhost:8080
```

## 🔐 Autenticación
La mayoría de los endpoints requieren autenticación JWT. Incluye el token en el header:
```
Authorization: Bearer <jwt-token>
```

---

## 📋 Tabla de Contenidos
1. [🔑 Autenticación](#-autenticación)
2. [👤 Gestión de Usuarios](#-gestión-de-usuarios)
3. [📄 Información Personal](#-información-personal)
4. [🆔 Documentos KYC](#-documentos-kyc)

---

## 🔑 Autenticación

### 📝 Registrar Usuario
**POST** `/24bet/auth/registro`

Registra un nuevo usuario en el sistema.

#### Request Body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "nombre": "John",
  "apellido": "Doe",
  "ladaTelefono": "55",
  "numeroTelefono": "12345678",
  "fechaNacimiento": "2024-08-10"
}
```

#### Response (201):
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "nombre": "John",
    "apellido": "Doe",
    "ladaTelefono": "55",
    "numeroTelefono": "12345678",
    "rol": "USER",
    "activo": true,
    "informacionPersonal": null
  }
}
```

#### Errores:
- **400**: Datos de entrada inválidos
- **409**: Usuario o email ya existente

---

### 🔐 Iniciar Sesión
**POST** `/24bet/auth/login`

Autentica un usuario y devuelve un token JWT.

#### Request Body:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

#### Response (200):
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tipo": "Bearer",
    "usuario": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "rol": "USER"
    }
  }
}
```

#### Errores:
- **400**: Datos de entrada inválidos
- **401**: Credenciales incorrectas

---

## 👤 Gestión de Usuarios

### 📋 Listar Todos los Usuarios
**GET** `/24bet/usuarios` 🔒 **ADMIN**

Obtiene una lista paginada de todos los usuarios.

#### Query Parameters:
- `page` (int): Página (default: 0)
- `size` (int): Tamaño de página (default: 20)
- `sort` (string): Ordenamiento (ej: "username,asc")

#### Response (200):
```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": {
    "content": [
      {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "nombre": "John",
        "apellido": "Doe",
        "rol": "USER",
        "activo": true
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 1,
    "totalPages": 1
  }
}
```

---

### 👤 Obtener Usuario por ID
**GET** `/24bet/usuarios/{id}` 🔒 **ADMIN o PROPIO**

Obtiene la información de un usuario específico.

#### Path Parameters:
- `id` (Long): ID del usuario

#### Response (200):
```json
{
  "success": true,
  "message": "Usuario obtenido exitosamente",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "nombre": "John",
    "apellido": "Doe",
    "ladaTelefono": "55",
    "numeroTelefono": "12345678",
    "rol": "USER",
    "activo": true,
    "informacionPersonal": {
      "primerNombre": "John",
      "apellidoPaterno": "Doe",
      "nombreCompleto": "John Doe",
      "direccionCompleta": "Calle Principal 123, Colonia Centro"
    }
  }
}
```

#### Errores:
- **404**: Usuario no encontrado
- **403**: Sin permisos

---

### 📝 Mi Perfil
**GET** `/24bet/usuarios/mi-perfil` 🔒 **AUTH**

Obtiene el perfil del usuario autenticado.

#### Response (200):
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "nombre": "John",
    "apellido": "Doe",
    "rol": "USER",
    "activo": true
  }
}
```

---

### ✏️ Editar Perfil Propio
**PUT** `/24bet/usuarios/{id}/perfil` 🔒 **PROPIO**

Permite a un usuario editar su propio perfil.

#### Request Body:
```json
{
  "email": "newemail@example.com",
  "nombre": "John Updated",
  "apellido": "Doe Updated",
  "ladaTelefono": "55",
  "numeroTelefono": "87654321",
  "fechaNacimiento": "2024-08-10T10:30:00",
  "informacionPersonal": {
    "primerNombre": "John",
    "segundoNombre": "Michael",
    "apellidoPaterno": "Doe",
    "apellidoMaterno": "Smith",
    "fechaNacimiento": "1990-01-01",
    "genero": "MASCULINO",
    "telefono": "5512345678",
    "calle": "Av. Principal",
    "numeroExterior": "123",
    "colonia": "Centro",
    "codigoPostal": "06000",
    "ciudad": "Ciudad de México",
    "estado": "CDMX",
    "pais": "México",
    "rfc": "DOEJ900101ABC",
    "estadoCivil": "SOLTERO",
    "ocupacion": "Desarrollador",
    "nacionalidad": "Mexicana"
  }
}
```

#### Response (200):
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "newemail@example.com",
    "nombre": "John Updated",
    "apellido": "Doe Updated",
    "informacionPersonal": {
      "nombreCompleto": "John Michael Doe Smith",
      "direccionCompleta": "Av. Principal 123, Centro, CP 06000, Ciudad de México"
    }
  }
}
```

---

### 🔑 Cambiar Contraseña
**PATCH** `/24bet/usuarios/{id}/cambiar-password` 🔒 **PROPIO**

Permite cambiar la contraseña del usuario.

#### Request Body:
```json
{
  "passwordActual": "oldpassword123",
  "nuevaPassword": "newpassword456",
  "confirmarPassword": "newpassword456"
}
```

#### Response (200):
```json
{
  "success": true,
  "message": "Contraseña cambiada exitosamente",
  "data": null
}
```

#### Errores:
- **400**: Contraseña actual incorrecta o las nuevas no coinciden

---

### 🛠️ Editar Usuario como Admin
**PUT** `/24bet/usuarios/{id}/admin` 🔒 **ADMIN**

Permite a un administrador editar cualquier campo de un usuario.

#### Request Body:
```json
{
  "username": "johndoe_updated",
  "email": "updated@example.com",
  "nombre": "John",
  "apellido": "Doe",
  "ladaTelefono": "55",
  "numeroTelefono": "12345678",
  "fechaNacimiento": "2024-08-10T10:30:00",
  "activo": true,
  "rol": "USER",
  "informacionPersonal": {
    "primerNombre": "John",
    "rfc": "DOEJ900101ABC"
  }
}
```

---

### ✅ Activar Usuario
**PATCH** `/24bet/usuarios/{id}/activar` 🔒 **ADMIN**

Activa un usuario desactivado.

#### Response (200):
```json
{
  "success": true,
  "message": "Usuario activado exitosamente",
  "data": null
}
```

---

### ❌ Desactivar Usuario
**PATCH** `/24bet/usuarios/{id}/desactivar` 🔒 **ADMIN**

Desactiva un usuario.

#### Response (200):
```json
{
  "success": true,
  "message": "Usuario desactivado exitosamente",
  "data": null
}
```

---

### 🗑️ Eliminar Usuario
**DELETE** `/24bet/usuarios/{id}` 🔒 **ADMIN**

Elimina permanentemente un usuario.

#### Response (200):
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente",
  "data": null
}
```

---

## 📄 Información Personal

### 📋 Obtener Información Personal
**GET** `/24bet/informacion-personal/{userId}` 🔒 **ADMIN o PROPIO**

Obtiene la información personal de un usuario.

#### Response (200):
```json
{
  "id": 1,
  "primerNombre": "John",
  "segundoNombre": "Michael",
  "apellidoPaterno": "Doe",
  "apellidoMaterno": "Smith",
  "fechaNacimiento": "1990-01-01",
  "genero": "MASCULINO",
  "telefono": "5512345678",
  "telefonoMovil": "5587654321",
  "calle": "Av. Principal",
  "numeroExterior": "123",
  "numeroInterior": "A",
  "colonia": "Centro",
  "codigoPostal": "06000",
  "ciudad": "Ciudad de México",
  "estado": "CDMX",
  "pais": "México",
  "rfc": "DOEJ900101ABC",
  "curp": "DOEJ900101HDFMXN09",
  "estadoCivil": "SOLTERO",
  "ocupacion": "Desarrollador",
  "nacionalidad": "Mexicana",
  "fechaCreacion": "2024-08-10T10:30:00",
  "fechaActualizacion": "2024-08-10T11:00:00",
  "nombreCompleto": "John Michael Doe Smith",
  "direccionCompleta": "Av. Principal 123 A, Centro, CP 06000, Ciudad de México, CDMX, México"
}
```

---

### 📄 Mi Información Personal
**GET** `/24bet/informacion-personal/mi-informacion` 🔒 **AUTH**

Obtiene la información personal del usuario autenticado.

---

### ✏️ Actualizar Información Personal
**PUT** `/24bet/informacion-personal/{userId}` 🔒 **ADMIN o PROPIO**

Actualiza la información personal de un usuario.

#### Request Body:
```json
{
  "primerNombre": "John",
  "segundoNombre": "Michael",
  "apellidoPaterno": "Doe",
  "apellidoMaterno": "Smith",
  "fechaNacimiento": "1990-01-01",
  "genero": "MASCULINO",
  "telefono": "5512345678",
  "telefonoMovil": "5587654321",
  "calle": "Av. Principal",
  "numeroExterior": "123",
  "numeroInterior": "A",
  "colonia": "Centro",
  "codigoPostal": "06000",
  "ciudad": "Ciudad de México",
  "estado": "CDMX",
  "pais": "México",
  "rfc": "DOEJ900101ABC",
  "curp": "DOEJ900101HDFMXN09",
  "estadoCivil": "SOLTERO",
  "ocupacion": "Desarrollador",
  "nacionalidad": "Mexicana"
}
```

---

### ✏️ Actualizar Mi Información Personal
**PUT** `/24bet/informacion-personal/mi-informacion` 🔒 **AUTH**

Actualiza la información personal del usuario autenticado.

---

## 🆔 Documentos KYC

### 📤 Subir Documento
**POST** `/24bet/kyc/documentos` 🔒 **AUTH**

Sube un documento para verificación KYC.

#### Request (multipart/form-data):
- `tipoDocumento`: "INE" | "COMPROBANTE_DOMICILIO"
- `archivo`: File (JPG, JPEG, PNG, PDF, BMP, TIFF - Max: 10MB)
- `observaciones`: string (opcional)

#### Response (200):
```json
{
  "id": 1,
  "usuarioId": 1,
  "usernameUsuario": "johndoe",
  "tipoDocumento": "INE",
  "tipoDocumentoDescripcion": "Credencial de Elector",
  "nombreArchivo": "ine_frente.jpg",
  "tipoMime": "image/jpeg",
  "tamañoArchivo": 2048576,
  "estado": "PENDIENTE",
  "estadoDescripcion": "Pendiente de revisión",
  "fechaSubida": "2024-08-10T10:30:00",
  "ipSubida": "192.168.1.100",
  "version": 1,
  "activo": true,
  "urlDescarga": "/24bet/kyc/documentos/1/descargar",
  "puedeResubir": false,
  "diasPendiente": 0
}
```

#### Errores:
- **400**: Archivo inválido (tipo o tamaño)

---

### 📊 Mi Estado KYC
**GET** `/24bet/kyc/mi-estado` 🔒 **AUTH**

Obtiene el estado completo de verificación KYC del usuario.

#### Response (200):
```json
{
  "usuarioId": 1,
  "username": "johndoe",
  "kycCompleto": false,
  "documentosAprobados": 1,
  "documentosPendientes": 1,
  "documentosDenegados": 0,
  "documentos": [
    {
      "id": 1,
      "tipoDocumento": "INE",
      "estado": "APROBADO",
      "fechaSubida": "2024-08-10T10:30:00"
    },
    {
      "id": 2,
      "tipoDocumento": "COMPROBANTE_DOMICILIO",
      "estado": "PENDIENTE",
      "fechaSubida": "2024-08-10T11:00:00"
    }
  ],
  "ine": {
    "tieneDocumento": true,
    "aprobado": true,
    "pendiente": false,
    "denegado": false,
    "ultimoDocumento": {
      "id": 1,
      "estado": "APROBADO"
    }
  },
  "comprobanteDomicilio": {
    "tieneDocumento": true,
    "aprobado": false,
    "pendiente": true,
    "denegado": false,
    "ultimoDocumento": {
      "id": 2,
      "estado": "PENDIENTE"
    }
  }
}
```

---

### 📋 Mis Documentos
**GET** `/24bet/kyc/mis-documentos` 🔒 **AUTH**

Obtiene todos los documentos KYC del usuario.

#### Response (200):
```json
[
  {
    "id": 1,
    "tipoDocumento": "INE",
    "nombreArchivo": "ine_frente.jpg",
    "estado": "APROBADO",
    "fechaSubida": "2024-08-10T10:30:00",
    "fechaRevision": "2024-08-10T12:00:00",
    "urlDescarga": "/24bet/kyc/documentos/1/descargar"
  },
  {
    "id": 2,
    "tipoDocumento": "COMPROBANTE_DOMICILIO",
    "nombreArchivo": "comprobante_cfe.pdf",
    "estado": "PENDIENTE",
    "fechaSubida": "2024-08-10T11:00:00",
    "diasPendiente": 5
  }
]
```

---

### 📄 Obtener Documento
**GET** `/24bet/kyc/documentos/{documentoId}` 🔒 **ADMIN o PROPIETARIO**

Obtiene información detallada de un documento.

---

### 📥 Descargar Documento
**GET** `/24bet/kyc/documentos/{documentoId}/descargar` 🔒 **ADMIN o PROPIETARIO**

Descarga el archivo de un documento KYC.

#### Response (200):
- Content-Type: application/octet-stream (o el tipo original)
- Content-Disposition: attachment; filename="documento.jpg"
- Body: archivo binario

---

### 🗑️ Eliminar Documento
**DELETE** `/24bet/kyc/documentos/{documentoId}` 🔒 **PROPIETARIO**

Elimina lógicamente un documento.

#### Response (204): Sin contenido

---

## 🛠️ Endpoints de Administración KYC

### 📋 Documentos Pendientes
**GET** `/24bet/kyc/admin/documentos/pendientes` 🔒 **ADMIN**

Obtiene documentos pendientes de revisión.

#### Query Parameters:
- `page`, `size`, `sort` (paginación)

#### Response (200):
```json
{
  "content": [
    {
      "id": 2,
      "usuarioId": 1,
      "usernameUsuario": "johndoe",
      "tipoDocumento": "COMPROBANTE_DOMICILIO",
      "estado": "PENDIENTE",
      "fechaSubida": "2024-08-10T11:00:00",
      "diasPendiente": 5
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

---

### 📊 Documentos por Estado
**GET** `/24bet/kyc/admin/documentos?estado={estado}` 🔒 **ADMIN**

Obtiene documentos filtrados por estado.

#### Query Parameters:
- `estado`: "PENDIENTE" | "APROBADO" | "DENEGADO" | "RESUBMITIR"
- `page`, `size`, `sort`

---

### 👤 Estado KYC de Usuario
**GET** `/24bet/kyc/admin/usuarios/{usuarioId}/estado` 🔒 **ADMIN**

Obtiene el estado KYC de cualquier usuario.

---

### ✅ Revisar Documento
**PUT** `/24bet/kyc/admin/documentos/{documentoId}/revisar` 🔒 **ADMIN**

Aprueba o deniega un documento KYC.

#### Request Body:
```json
{
  "aprobado": true,
  "observaciones": "Documento válido y legible",
  "motivoRechazo": null
}
```

#### Request Body (Rechazo):
```json
{
  "aprobado": false,
  "observaciones": "Documento borroso",
  "motivoRechazo": "La imagen no es clara, favor de reenviar"
}
```

#### Response (200):
```json
{
  "id": 2,
  "estado": "APROBADO",
  "fechaRevision": "2024-08-10T15:30:00",
  "revisadoPorAdminId": 5,
  "observaciones": "Documento válido y legible"
}
```

---

## 📝 Notas Importantes

### 🔐 Roles de Usuario:
- **USER**: Usuario regular
- **ADMIN**: Administrador con permisos especiales

### 📁 Tipos de Documento KYC:
- **INE**: Credencial de Elector
- **COMPROBANTE_DOMICILIO**: Comprobante de Domicilio

### 📊 Estados de Documento:
- **PENDIENTE**: Pendiente de revisión
- **APROBADO**: Aprobado por administrador
- **DENEGADO**: Denegado, requiere reenvío
- **RESUBMITIR**: Requiere reenvío

### 📄 Formatos de Archivo Soportados:
- Imágenes: JPG, JPEG, PNG, BMP, TIFF
- Documentos: PDF
- Tamaño máximo: 10 MB

### 🔄 Códigos de Error Comunes:
- **200**: Éxito
- **201**: Creado
- **204**: Sin contenido
- **400**: Solicitud incorrecta
- **401**: No autorizado
- **403**: Prohibido
- **404**: No encontrado
- **409**: Conflicto
- **500**: Error interno del servidor

### 📱 Headers Requeridos:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json (excepto uploads)
```

### 🌐 CORS:
Configurado para permitir todas las origins (`*`) en desarrollo.

---

*Documentación generada para 24bet Backend API v1.0*
