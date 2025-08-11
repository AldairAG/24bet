# 24bet Backend - Sistema de Autenticación JWT

Este es el backend de la aplicación 24bet que incluye un sistema completo de autenticación con JWT.

## Características

- ✅ Registro de usuarios con validaciones
- ✅ Login con JWT
- ✅ Endpoints protegidos 
- ✅ Autenticación con username o email
- ✅ Documentación con Swagger
- ✅ Manejo global de excepciones
- ✅ Configuración de CORS
- ✅ Base de datos PostgreSQL

## Tecnologías

- Spring Boot 3.5.4
- Spring Security
- JWT (JSON Web Tokens)
- JPA/Hibernate
- PostgreSQL
- Lombok
- Swagger/OpenAPI

## Configuración

### Base de Datos

Asegúrate de tener PostgreSQL ejecutándose y actualiza las credenciales en `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cc_db
spring.datasource.username=postgres
spring.datasource.password=tu_password_aqui
```

### Variables de Entorno

Puedes usar variables de entorno para la configuración:

```bash
DB_URL=jdbc:postgresql://localhost:5432/cc_db
DB_USER_NAME=postgres
DB_PASSWORD=tu_password_aqui
```

## Ejecutar la Aplicación

```bash
# Compilar
./mvnw clean compile

# Ejecutar
./mvnw spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

## Documentación API

Una vez ejecutada la aplicación, puedes acceder a la documentación de Swagger en:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Endpoints Principales

### Autenticación (Públicos)

#### POST `/api/auth/registro`
Registrar nuevo usuario

```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+1234567890"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+1234567890",
    "rol": "USER",
    "activo": true
  }
}
```

#### POST `/api/auth/login`
Iniciar sesión

```json
{
  "username": "usuario123",  // Puede ser username o email
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 1,
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "USER"
  }
}
```

### Endpoints Protegidos (Requieren JWT)

#### GET `/api/usuario/perfil`
Obtener perfil del usuario autenticado

**Headers requeridos:**
```
Authorization: Bearer {tu_token_jwt}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+1234567890",
    "rol": "USER",
    "activo": true,
    "fechaCreacion": "2024-08-09T15:30:00"
  }
}
```

#### GET `/api/usuario/test`
Endpoint de prueba para verificar autenticación

## Uso del Token JWT

Para acceder a endpoints protegidos, incluye el token en el header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

El token tiene una validez de 24 horas por defecto.

## Estructura del Proyecto

```
src/
├── main/
│   ├── java/com/_bet/
│   │   ├── config/           # Configuraciones (Security, Swagger, etc.)
│   │   ├── controller/       # Controladores REST
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # Entidades JPA
│   │   ├── repository/      # Repositorios JPA
│   │   ├── security/        # Filtros y clases de seguridad
│   │   ├── service/         # Servicios de negocio
│   │   └── Application.java
│   └── resources/
│       └── application.properties
```

## Casos de Error

### Registro

- **409 Conflict**: Username o email ya existe
- **400 Bad Request**: Datos de entrada inválidos

### Login

- **401 Unauthorized**: Credenciales incorrectas
- **400 Bad Request**: Datos faltantes

### Endpoints Protegidos

- **401 Unauthorized**: Token faltante o inválido
- **403 Forbidden**: Token expirado

## Ejemplos de Prueba con cURL

### Registro
```bash
curl -X POST http://localhost:8080/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "nombre": "Test",
    "apellido": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Acceso a endpoint protegido
```bash
curl -X GET http://localhost:8080/api/usuario/perfil \
  -H "Authorization: Bearer tu_token_aqui"
```

## Desarrollo

Para desarrollo local:

1. Clona el repositorio
2. Configura PostgreSQL
3. Actualiza `application.properties`
4. Ejecuta `./mvnw spring-boot:run`

## Próximas Características

- [ ] Refresh tokens
- [ ] Roles y permisos avanzados
- [ ] Reset de contraseña
- [ ] Verificación de email
- [ ] Rate limiting
- [ ] Auditoría de accesos
