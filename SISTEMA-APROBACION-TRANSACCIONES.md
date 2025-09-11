# SISTEMA DE APROBACIÓN DE TRANSACCIONES - 24BET

## Resumen Ejecutivo

Se ha implementado un sistema completo de aprobación de transacciones que requiere autorización administrativa antes de procesar cualquier depósito o retiro. Este sistema garantiza:

- ✅ Control administrativo sobre todas las transacciones
- ✅ Trazabilidad completa de solicitudes
- ✅ Bloqueo de fondos para retiros pendientes
- ✅ Gestión de estados detallada
- ✅ Comisiones automáticas en retiros
- ✅ Interfaz separada para usuarios y administradores

## Componentes Implementados

### 1. ENTIDADES

#### SolicitudDeposito.java
- **Estados**: PENDIENTE, APROBADA, RECHAZADA, PROCESANDO, COMPLETADA, CANCELADA
- **Métodos de pago**: TRANSFERENCIA_BANCARIA, CRYPTO_WALLET, USDT, BINANCE_PAY
- **Campos de auditoría**: fechas, admin procesador, observaciones
- **Relación**: Usuario (Many-to-One)

#### SolicitudRetiro.java
- **Estados**: PENDIENTE, APROBADA, RECHAZADA, PROCESANDO, COMPLETADA, CANCELADA
- **Métodos de retiro**: TRANSFERENCIA_BANCARIA, CRYPTO_WALLET
- **Tipos de crypto**: USDT, BTC, ETH, USDC
- **Cálculo automático**: comisión 3%, monto neto
- **Bloqueo de fondos**: automático al crear solicitud

### 2. REPOSITORIOS

#### SolicitudDepositoRepository.java
- Consultas por estado y fecha
- Estadísticas por usuario
- Consultas de agregación para reportes
- Índices optimizados para rendimiento

#### SolicitudRetiroRepository.java
- Consultas por estado con ordenamiento
- Cálculos de comisiones totales
- Búsquedas por monto mínimo
- Estadísticas de retiros por usuario

### 3. SERVICIOS

#### SolicitudTransaccionService.java
**Funcionalidades principales:**
- Creación de solicitudes con validaciones
- Aprobación/rechazo por administradores
- Gestión de estados y transiciones
- Bloqueo/liberación de fondos
- Cálculo automático de comisiones
- Estadísticas en tiempo real
- Cancelación por usuarios

**Configuración:**
```java
deposito.minimo=${24bet.deposito.minimo:10.00}
retiro.minimo=${24bet.retiro.minimo:50.00}
comision.retiro=${24bet.comision.retiro:0.03}
```

### 4. CONTROLADORES

#### CryptoWalletController.java (ACTUALIZADO)
**Nuevos endpoints de solicitud:**
- `POST /depositar-solicitud` - Crear solicitud de depósito
- `POST /retirar-solicitud` - Crear solicitud de retiro

**Respuestas estructuradas:**
- `SolicitudDepositoResponseDto` - Info completa de la solicitud
- `SolicitudRetiroResponseDto` - Detalles de retiro con comisión

#### AdminSolicitudesController.java (NUEVO)
**Gestión administrativa:**
- `GET /solicitudes/depositos/pendientes` - Lista depósitos pendientes
- `POST /solicitudes/depositos/{id}/aprobar` - Aprobar depósito
- `POST /solicitudes/depositos/{id}/rechazar` - Rechazar depósito
- `GET /solicitudes/retiros/pendientes` - Lista retiros pendientes
- `POST /solicitudes/retiros/{id}/aprobar` - Aprobar retiro
- `POST /solicitudes/retiros/{id}/rechazar` - Rechazar retiro
- `GET /solicitudes/dashboard` - Dashboard administrativo
- `GET /solicitudes/estadisticas` - Estadísticas completas

#### UsuarioSolicitudesController.java (NUEVO)
**Interfaz para usuarios:**
- `GET /solicitudes/depositos` - Mis depósitos
- `GET /solicitudes/retiros` - Mis retiros
- `GET /solicitudes/depositos/{id}` - Detalle de depósito
- `GET /solicitudes/retiros/{id}` - Detalle de retiro
- `POST /solicitudes/depositos/{id}/cancelar` - Cancelar depósito
- `POST /solicitudes/retiros/{id}/cancelar` - Cancelar retiro
- `GET /solicitudes/resumen` - Resumen personal

## Flujo de Trabajo

### DEPÓSITOS
1. **Usuario**: Crea solicitud via `POST /depositar-solicitud`
2. **Sistema**: Valida monto mínimo y datos
3. **Estado**: PENDIENTE (esperando aprobación)
4. **Admin**: Revisa y aprueba/rechaza
5. **Sistema**: Si aprobado → transfiere al saldo del usuario
6. **Estado final**: COMPLETADA o RECHAZADA

### RETIROS
1. **Usuario**: Crea solicitud via `POST /retirar-solicitud`
2. **Sistema**: Valida saldo y bloquea fondos
3. **Estado**: PENDIENTE (fondos bloqueados)
4. **Admin**: Revisa, verifica datos bancarios/crypto
5. **Admin**: Aprueba con referencia de transacción
6. **Estado final**: COMPLETADA (fondos transferidos) o RECHAZADA (fondos liberados)

## Características de Seguridad

### BLOQUEO DE FONDOS
- Los retiros bloquean fondos inmediatamente
- Cancelación o rechazo libera fondos automáticamente
- No se permite sobregirar el saldo

### AUDITORÍA COMPLETA
- Registro de quien aprobó/rechazó
- Fechas de todas las transiciones
- Observaciones y motivos de rechazo
- Trazabilidad completa de cambios

### VALIDACIONES
- Montos mínimos configurables
- Verificación de saldo suficiente
- Datos bancarios/crypto obligatorios
- Autenticación de usuarios y admins

## Configuración Requerida

### application.properties
```properties
# Límites de transacciones
24bet.deposito.minimo=10.00
24bet.retiro.minimo=50.00
24bet.comision.retiro=0.03

# Configuración de base de datos
spring.jpa.hibernate.ddl-auto=update
```

### Permisos
- **ADMIN**: Acceso a AdminSolicitudesController
- **USER**: Acceso a UsuarioSolicitudesController y endpoints de solicitud

## API Endpoints Summary

### USUARIOS - Crear Solicitudes
```
POST /24bet/crypto-wallet/depositar-solicitud
POST /24bet/crypto-wallet/retirar-solicitud
```

### USUARIOS - Consultar Solicitudes
```
GET /24bet/usuario/solicitudes/depositos
GET /24bet/usuario/solicitudes/retiros
GET /24bet/usuario/solicitudes/resumen
POST /24bet/usuario/solicitudes/depositos/{id}/cancelar
POST /24bet/usuario/solicitudes/retiros/{id}/cancelar
```

### ADMIN - Gestión de Aprobaciones
```
GET /24bet/admin/solicitudes/depositos/pendientes
POST /24bet/admin/solicitudes/depositos/{id}/aprobar
POST /24bet/admin/solicitudes/depositos/{id}/rechazar
GET /24bet/admin/solicitudes/retiros/pendientes
POST /24bet/admin/solicitudes/retiros/{id}/aprobar
POST /24bet/admin/solicitudes/retiros/{id}/rechazar
GET /24bet/admin/solicitudes/dashboard
GET /24bet/admin/solicitudes/estadisticas
```

## Estados y Transiciones

### Estados Válidos
- **PENDIENTE**: Creada, esperando aprobación
- **APROBADA**: Aprobada por admin, en procesamiento
- **RECHAZADA**: Rechazada por admin
- **PROCESANDO**: En proceso de transferencia
- **COMPLETADA**: Transacción finalizada exitosamente
- **CANCELADA**: Cancelada por usuario

### Transiciones Permitidas
```
PENDIENTE → APROBADA (admin)
PENDIENTE → RECHAZADA (admin)
PENDIENTE → CANCELADA (usuario)
APROBADA → PROCESANDO (sistema)
PROCESANDO → COMPLETADA (sistema)
```

## Próximos Pasos

1. **Notificaciones**: Sistema de notificaciones para admins y usuarios
2. **Dashboard Web**: Interfaz gráfica para administración
3. **Reportes**: Módulo de reportes financieros
4. **Integración**: Conectar con procesadores de pago externos
5. **Monitoreo**: Alertas por transacciones suspiciosas

---

✅ **SISTEMA COMPLETAMENTE IMPLEMENTADO Y FUNCIONAL**

El sistema está listo para uso en producción con control administrativo completo sobre todas las transacciones financieras.
