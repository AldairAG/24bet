# Scheduler - Tareas Programadas

Esta carpeta contiene toda la configuración y tareas programadas del sistema 24bet.

## 📁 Estructura

```
scheduler/
├── config/
│   └── SchedulerConfig.java          # Configuración de scheduling y async
└── tasks/
    ├── TheSportsDbScheduledTasks.java # Tareas de sincronización deportiva
    └── MaintenanceScheduledTasks.java # Tareas de mantenimiento del sistema
```

## ⚙️ Configuración

### SchedulerConfig.java
- **@EnableScheduling**: Habilita las tareas programadas
- **@EnableAsync**: Habilita ejecución asíncrona
- **TaskScheduler**: Pool de hilos para tareas programadas (5 hilos)
- **AsyncTaskExecutor**: Pool de hilos para tareas asíncronas generales (5-15 hilos)
- **TheSportsDbTaskExecutor**: Pool de hilos específico para TheSportsDB (3-8 hilos)

## 🏃‍♂️ Tareas Programadas

### TheSportsDbScheduledTasks.java

#### 🔄 Sincronización de Eventos (cada 6 horas)
```java
@Scheduled(fixedRate = 21600000, zone = "America/Mexico_City")
```
- **Frecuencia**: Cada 6 horas
- **Función**: Sincroniza eventos próximos y de temporada actual
- **Executor**: `theSportsDbTaskExecutor`

#### 📊 Sincronización de Datos Maestros (diaria a las 2:00 AM)
```java
@Scheduled(cron = "0 0 2 * * *", zone = "America/Mexico_City")
```
- **Frecuencia**: Diaria a las 2:00 AM
- **Función**: Sincroniza deportes, ligas y equipos
- **Executor**: `theSportsDbTaskExecutor`

#### 🧹 Limpieza Semanal (domingos a las 3:00 AM)
```java
@Scheduled(cron = "0 0 3 * * SUN", zone = "America/Mexico_City")
```
- **Frecuencia**: Domingos a las 3:00 AM
- **Función**: Limpia datos antiguos (>2 años)
- **Executor**: `theSportsDbTaskExecutor`

#### 🔴 Eventos en Vivo (cada 5 minutos, 8 AM - 12 AM)
```java
@Scheduled(fixedRate = 300000)
```
- **Frecuencia**: Cada 5 minutos
- **Horario**: Solo entre 8:00 AM y 11:59 PM
- **Función**: Actualiza eventos en vivo
- **Executor**: `theSportsDbTaskExecutor`

#### 🚀 Sincronización Inicial (al arrancar la aplicación)
```java
@EventListener(ApplicationReadyEvent.class)
```
- **Evento**: Al arrancar la aplicación
- **Condición**: Solo si hay menos de 5 deportes, 10 ligas o 50 equipos
- **Función**: Sincronización inicial completa
- **Executor**: `theSportsDbTaskExecutor`

### MaintenanceScheduledTasks.java

#### 🧹 Mantenimiento Semanal (domingos a las 4:00 AM)
```java
@Scheduled(cron = "0 0 4 * * SUN", zone = "America/Mexico_City")
```
- **Frecuencia**: Domingos a las 4:00 AM
- **Función**: Limpieza general y reactivación de datos
- **Executor**: `asyncTaskExecutor`

#### 📈 Reporte Diario (diario a las 8:00 AM)
```java
@Scheduled(cron = "0 0 8 * * *", zone = "America/Mexico_City")
```
- **Frecuencia**: Diaria a las 8:00 AM
- **Función**: Genera estadísticas en logs
- **Executor**: `asyncTaskExecutor`

## 🕐 Zona Horaria

Todas las tareas usan la zona horaria `America/Mexico_City`.

## 📝 Expresiones Cron

Formato: `segundo minuto hora día_mes mes día_semana`

- `0 0 2 * * *` = Todos los días a las 2:00 AM
- `0 0 3 * * SUN` = Domingos a las 3:00 AM
- `0 0 4 * * SUN` = Domingos a las 4:00 AM
- `0 0 8 * * *` = Todos los días a las 8:00 AM

## 🔧 Personalización

### Cambiar Frecuencias

1. **Eventos cada 3 horas**:
   ```java
   @Scheduled(fixedRate = 10800000) // 3 horas en ms
   ```

2. **Datos maestros cada 12 horas**:
   ```java
   @Scheduled(cron = "0 0 */12 * * *")
   ```

3. **Eventos en vivo cada minuto**:
   ```java
   @Scheduled(fixedRate = 60000) // 1 minuto
   ```

### Deshabilitar Tareas

Comenta la anotación `@Scheduled` o cambia la condición:

```java
@Scheduled(fixedRate = 21600000)
public void sincronizacionEventosAutomatica() {
    if (false) return; // Deshabilitar temporalmente
    // ... resto del código
}
```

## 🚨 Monitoreo

Los logs muestran el estado de cada tarea:
- ✅ = Completada exitosamente
- ❌ = Error
- 🔄 = Iniciando
- ℹ️ = Información
- 📊 = Estadísticas

## 🎯 Mejores Prácticas

1. **Siempre usar @Async** para tareas largas
2. **Incluir try-catch** en todas las tareas
3. **Loggear inicio y fin** de cada tarea
4. **Usar diferentes executors** según el tipo de tarea
5. **Incluir timeouts** para evitar bloqueos
6. **Monitorear recursos** del sistema
