# 🚀 24bet Backend - Guía Técnica

## 📋 Resumen de Endpoints

### 🔑 Autenticación (`/24bet/auth`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/registro` | Registrar usuario | ❌ |
| POST | `/login` | Iniciar sesión | ❌ |

### 👤 Usuarios (`/24bet/usuarios`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar usuarios | 🔒 ADMIN |
| GET | `/{id}` | Obtener usuario | 🔒 ADMIN/OWNER |
| GET | `/mi-perfil` | Mi perfil | 🔒 AUTH |
| PUT | `/{id}/perfil` | Editar perfil | 🔒 OWNER |
| PUT | `/{id}/admin` | Editar como admin | 🔒 ADMIN |
| PATCH | `/{id}/cambiar-password` | Cambiar contraseña | 🔒 OWNER |
| PATCH | `/{id}/activar` | Activar usuario | 🔒 ADMIN |
| PATCH | `/{id}/desactivar` | Desactivar usuario | 🔒 ADMIN |
| DELETE | `/{id}` | Eliminar usuario | 🔒 ADMIN |

### 📄 Información Personal (`/api/informacion-personal`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/{userId}` | Obtener información | 🔒 ADMIN/OWNER |
| GET | `/mi-informacion` | Mi información | 🔒 AUTH |
| PUT | `/{userId}` | Actualizar información | 🔒 ADMIN/OWNER |
| PUT | `/mi-informacion` | Actualizar mi información | 🔒 AUTH |

### 🆔 KYC (`/24bet/kyc`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/documentos` | Subir documento | 🔒 AUTH |
| GET | `/mi-estado` | Mi estado KYC | 🔒 AUTH |
| GET | `/mis-documentos` | Mis documentos | 🔒 AUTH |
| GET | `/documentos/{id}` | Obtener documento | 🔒 ADMIN/OWNER |
| GET | `/documentos/{id}/descargar` | Descargar documento | 🔒 ADMIN/OWNER |
| DELETE | `/documentos/{id}` | Eliminar documento | 🔒 OWNER |

### 🛠️ KYC Admin (`/24bet/kyc/admin`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/documentos/pendientes` | Documentos pendientes | 🔒 ADMIN |
| GET | `/documentos?estado=X` | Documentos por estado | 🔒 ADMIN |
| GET | `/usuarios/{id}/estado` | Estado KYC usuario | 🔒 ADMIN |
| PUT | `/documentos/{id}/revisar` | Revisar documento | 🔒 ADMIN |

---

## 🏗️ Arquitectura del Proyecto

```
src/main/java/com/_bet/
├── 🎮 controller/          # Controladores REST
│   ├── AuthController.java
│   ├── UsuarioCrudController.java
│   ├── InformacionPersonalController.java
│   └── DocumentoKycController.java
│
├── 📊 dto/                 # Data Transfer Objects
│   ├── request/
│   │   ├── RegistroRequest.java
│   │   ├── LoginRequest.java
│   │   ├── EditarPerfilRequest.java
│   │   ├── EditarUsuarioAdminRequest.java
│   │   ├── CambiarPasswordRequest.java
│   │   ├── InformacionPersonalRequest.java
│   │   ├── SubirDocumentoRequest.java
│   │   └── RevisionDocumentoRequest.java
│   └── response/
│       ├── JwtResponse.java
│       ├── UsuarioResponse.java
│       ├── InformacionPersonalResponse.java
│       ├── DocumentoKycResponse.java
│       └── EstadoKycResponse.java
│
├── 🗃️ entity/              # Entidades JPA
│   ├── Usuario.java
│   ├── InformacionPersonal.java
│   └── DocumentoKyc.java
│
├── 🔍 repository/          # Repositorios JPA
│   ├── UsuarioRepository.java
│   └── DocumentoKycRepository.java
│
├── ⚙️ service/             # Lógica de negocio
│   ├── auth/
│   │   ├── AuthService.java
│   │   └── AuthServiceImpl.java
│   ├── user/
│   │   ├── UsuarioService.java
│   │   └── UsuarioServiceImpl.java
│   ├── file/
│   │   ├── FileStorageService.java
│   │   └── FileStorageServiceImpl.java
│   └── kyc/
│       ├── DocumentoKycService.java
│       └── DocumentoKycServiceImpl.java
│
├── 🔐 security/            # Configuración seguridad
│   └── JwtAuthenticationFilter.java
│
├── 🛠️ config/             # Configuraciones
│   └── SecurityConfig.java
│
└── 🆔 helpers/            # Utilidades
    └── JwtHelper.java
```

---

## 🗄️ Modelo de Base de Datos

### 👤 Usuario
```sql
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    lada_telefono VARCHAR(5),
    numero_telefono VARCHAR(15),
    fecha_nacimiento TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    rol VARCHAR(20) DEFAULT 'USER',
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    informacion_personal_id BIGINT REFERENCES informacion_personal(id)
);
```

### 📄 Información Personal
```sql
CREATE TABLE informacion_personal (
    id BIGSERIAL PRIMARY KEY,
    primer_nombre VARCHAR(50),
    segundo_nombre VARCHAR(50),
    apellido_paterno VARCHAR(50),
    apellido_materno VARCHAR(50),
    fecha_nacimiento DATE,
    genero VARCHAR(20),
    telefono VARCHAR(15),
    telefono_movil VARCHAR(15),
    calle VARCHAR(100),
    numero_exterior VARCHAR(10),
    numero_interior VARCHAR(10),
    colonia VARCHAR(100),
    codigo_postal VARCHAR(10),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    pais VARCHAR(100),
    rfc VARCHAR(13) UNIQUE,
    curp VARCHAR(18) UNIQUE,
    estado_civil VARCHAR(20),
    ocupacion VARCHAR(100),
    nacionalidad VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW()
);
```

### 🆔 Documentos KYC
```sql
CREATE TABLE documentos_kyc (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    tipo_documento VARCHAR(50) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_mime VARCHAR(100),
    tamaño_archivo BIGINT,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    motivo_rechazo TEXT,
    observaciones TEXT,
    fecha_subida TIMESTAMP DEFAULT NOW(),
    fecha_revision TIMESTAMP,
    revisado_por_admin_id BIGINT,
    ip_subida VARCHAR(45),
    version INTEGER DEFAULT 1,
    activo BOOLEAN DEFAULT true
);
```

---

## 🔐 Sistema de Autenticación

### JWT Token Structure:
```json
{
  "sub": "1",
  "username": "johndoe",
  "rol": "USER",
  "iat": 1692000000,
  "exp": 1692086400
}
```

### Headers Requeridos:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Roles y Permisos:
- **USER**: Operaciones básicas (perfil propio, documentos propios)
- **ADMIN**: Todas las operaciones (gestión usuarios, revisión KYC)

---

## 📁 Gestión de Archivos

### Configuración:
```properties
app.file.storage.path=./uploads
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Estructura de Directorios:
```
uploads/
└── kyc/
    ├── kyc_johndoe_INE_1_20240810_123456_abc12345.jpg
    ├── kyc_johndoe_COMPROBANTE_DOMICILIO_1_20240810_123457_def67890.pdf
    └── ...
```

### Validaciones de Archivo:
- **Extensiones**: .jpg, .jpeg, .png, .pdf, .bmp, .tiff
- **Tamaño máximo**: 10 MB
- **Nomenclatura**: `kyc_{username}_{tipo}_{userId}_{timestamp}_{uuid}.{ext}`

---

## 🎯 Casos de Uso Principales

### 1. Registro y Login
```mermaid
sequenceDiagram
    Client->>AuthController: POST /registro
    AuthController->>AuthService: registrar()
    AuthService->>UsuarioRepository: save()
    AuthService-->>AuthController: UsuarioResponse
    AuthController-->>Client: 201 Created
    
    Client->>AuthController: POST /login
    AuthController->>AuthService: login()
    AuthService->>JwtHelper: generarToken()
    AuthService-->>AuthController: JwtResponse
    AuthController-->>Client: 200 OK + JWT
```

### 2. Proceso KYC
```mermaid
sequenceDiagram
    User->>DocumentoKycController: POST /kyc/documentos
    DocumentoKycController->>DocumentoKycService: subirDocumento()
    DocumentoKycService->>FileStorageService: almacenarArchivo()
    DocumentoKycService->>DocumentoKycRepository: save()
    DocumentoKycService-->>DocumentoKycController: DocumentoKycResponse
    
    Admin->>DocumentoKycController: PUT /kyc/admin/documentos/{id}/revisar
    DocumentoKycController->>DocumentoKycService: revisarDocumento()
    DocumentoKycService->>DocumentoKycRepository: save() [APROBADO/DENEGADO]
```

### 3. Gestión de Perfil
```mermaid
sequenceDiagram
    User->>UsuarioCrudController: PUT /usuarios/{id}/perfil
    UsuarioCrudController->>UsuarioService: editarPerfil()
    UsuarioService->>UsuarioRepository: save()
    UsuarioService-->>UsuarioCrudController: UsuarioResponse
```

---

## ⚡ Optimizaciones y Mejores Prácticas

### 🏃‍♂️ Performance:
- Paginación en todas las listas
- Lazy loading en relaciones JPA
- Indexación en campos de búsqueda frecuente

### 🛡️ Seguridad:
- Validación de entrada con Bean Validation
- Sanitización de nombres de archivo
- Control de acceso granular con Spring Security
- Hash de contraseñas con BCrypt

### 📊 Auditoría:
- Timestamps automáticos (`@PrePersist`, `@PreUpdate`)
- Registro de IP en operaciones sensibles
- Versionado de documentos
- Logs estructurados con SLF4J

### 🗃️ Base de Datos:
- Soft delete (campo `activo`)
- Constraints de integridad referencial
- Campos únicos para evitar duplicados

---

## 🧪 Testing

### Estructura de Tests:
```
src/test/java/com/_bet/
├── controller/
├── service/
├── repository/
└── integration/
```

### Ejemplos de Prueba:
```java
@Test
void deberiaRegistrarUsuarioCorrectamente() {
    RegistroRequest request = new RegistroRequest();
    request.setUsername("testuser");
    request.setEmail("test@example.com");
    
    UsuarioResponse response = authService.registrar(request);
    
    assertThat(response.getUsername()).isEqualTo("testuser");
    assertThat(response.getRol()).isEqualTo("USER");
}
```

---

## 🚀 Deployment

### Variables de Entorno:
```bash
DB_URL=jdbc:postgresql://localhost:5432/bet24_db
DB_USER_NAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
APP_FILE_STORAGE_PATH=./uploads
```

### Docker Compose:
```yaml
version: '3.8'
services:
  app:
    image: 24bet-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DB_URL=jdbc:postgresql://db:5432/bet24_db
      - DB_USER_NAME=postgres
      - DB_PASSWORD=password
    volumes:
      - ./uploads:/app/uploads
  
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: bet24_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

## 📚 Recursos Adicionales

### 📖 Documentación:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `http://localhost:8080/v3/api-docs`

### 🔧 Herramientas de Desarrollo:
- **IDE**: IntelliJ IDEA / VS Code
- **Database**: PostgreSQL + pgAdmin
- **Testing**: Postman / Thunder Client
- **Logs**: Application logs en consola

### 📦 Dependencias Principales:
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
    </dependency>
</dependencies>
```

---

*Documentación técnica para desarrolladores - 24bet Backend v1.0*
