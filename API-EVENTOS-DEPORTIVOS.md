# API de Eventos Deportivos con Momios en Tiempo Real

## Descripción
Esta API proporciona endpoints REST y conexiones WebSocket para gestionar eventos deportivos con sus momios correspondientes, diseñada específicamente para aplicaciones de casino y apuestas deportivas en tiempo real.

## Características Principales
- ✅ Eventos deportivos con información completa
- ✅ Momios/cuotas actualizados en tiempo real
- ✅ Soporte para eventos en vivo y próximos
- ✅ WebSocket para actualizaciones automáticas
- ✅ Paginación y filtrado avanzado
- ✅ Documentación Swagger/OpenAPI

## Endpoints REST

### Base URL
```
http://localhost:8080/api/eventos-deportivos
```

### Principales Endpoints

#### 1. Obtener todos los eventos con momios (Paginado)
```http
GET /api/eventos-deportivos?page=0&size=20
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Eventos obtenidos exitosamente",
  "data": {
    "content": [
      {
        "id": 1,
        "nombre": "Barcelona vs Real Madrid",
        "fechaEvento": "2025-09-20T20:00:00",
        "estado": "Not Started",
        "enVivo": false,
        "liga": {
          "nombre": "La Liga",
          "pais": "Spain"
        },
        "equipoLocal": {
          "nombre": "FC Barcelona",
          "logoUrl": "https://..."
        },
        "equipoVisitante": {
          "nombre": "Real Madrid",
          "logoUrl": "https://..."
        },
        "momios": [
          {
            "tipoApuesta": "WIN_HOME",
            "resultado": "HOME",
            "valor": 2.15,
            "activo": true
          },
          {
            "tipoApuesta": "WIN_AWAY",
            "resultado": "AWAY",
            "valor": 3.25,
            "activo": true
          },
          {
            "tipoApuesta": "DRAW",
            "resultado": "DRAW",
            "valor": 3.10,
            "activo": true
          }
        ]
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 150,
    "totalPages": 8
  },
  "timestamp": "2025-09-15T10:30:00"
}
```

#### 2. Obtener eventos en vivo
```http
GET /api/eventos-deportivos/en-vivo
```

#### 3. Obtener eventos próximos (24 horas)
```http
GET /api/eventos-deportivos/proximos
```

#### 4. Obtener evento específico por ID
```http
GET /api/eventos-deportivos/{id}
```

#### 5. Obtener momios de un evento
```http
GET /api/eventos-deportivos/{id}/momios
```

#### 6. Obtener eventos por rango de fechas
```http
GET /api/eventos-deportivos/por-fechas?fechaInicio=2025-09-15T00:00:00&fechaFin=2025-09-16T23:59:59
```

#### 7. Obtener eventos por liga
```http
GET /api/eventos-deportivos/por-liga/{ligaSportsDbId}
```

#### 8. Obtener estadísticas
```http
GET /api/eventos-deportivos/estadisticas
```

## WebSocket en Tiempo Real

### Conexión WebSocket
```javascript
// Conectar al servidor WebSocket
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Conectado: ' + frame);
    
    // Suscribirse a actualizaciones de momios
    stompClient.subscribe('/topic/momios-actualizados', function(message) {
        const data = JSON.parse(message.body);
        console.log('Momios actualizados:', data);
    });
    
    // Suscribirse a eventos en vivo
    stompClient.subscribe('/topic/eventos-vivo', function(message) {
        const data = JSON.parse(message.body);
        console.log('Eventos en vivo:', data);
    });
});
```

### Canales de Suscripción Disponibles

#### 1. Momios actualizados (cada 30 segundos)
```javascript
stompClient.subscribe('/topic/momios-actualizados', callback);
```

#### 2. Eventos próximos (cada 2 minutos)
```javascript
stompClient.subscribe('/topic/eventos-proximos', callback);
```

#### 3. Eventos específicos
```javascript
stompClient.subscribe('/topic/evento/{eventoId}', callback);
```

#### 4. Momios de evento específico
```javascript
stompClient.subscribe('/topic/evento/{eventoId}/momios', callback);
```

#### 5. Estadísticas en tiempo real (cada 5 minutos)
```javascript
stompClient.subscribe('/topic/estadisticas', callback);
```

#### 6. Notificaciones generales
```javascript
stompClient.subscribe('/topic/notificaciones', callback);
```

### Tipos de Mensajes WebSocket

#### Momios Actualizados
```json
{
  "tipo": "MOMIOS_ACTUALIZADOS",
  "eventos": [...],
  "timestamp": "2025-09-15T10:30:00",
  "totalEventos": 5
}
```

#### Nuevo Evento en Vivo
```json
{
  "tipo": "NUEVO_EVENTO_VIVO",
  "evento": {...},
  "mensaje": "¡Nuevo evento en vivo disponible para apostar!",
  "timestamp": "2025-09-15T10:30:00"
}
```

#### Momio Actualizado
```json
{
  "tipo": "MOMIO_ACTUALIZADO",
  "eventoId": 123,
  "momio": {
    "id": 456,
    "tipoApuesta": "WIN_HOME",
    "valor": 2.25,
    "timestamp": "2025-09-15T10:30:00"
  }
}
```

## Modelos de Datos

### EventoDeportivoConMomiosDto
```json
{
  "id": 1,
  "sportsDbId": "12345",
  "nombre": "String",
  "descripcion": "String",
  "fechaEvento": "DateTime",
  "temporada": "String",
  "estado": "String",
  "enVivo": "Boolean",
  "liga": "LigaDto",
  "equipoLocal": "EquipoDto",
  "equipoVisitante": "EquipoDto",
  "momios": ["MomioDto"]
}
```

### MomioDto
```json
{
  "id": 1,
  "tipoApuesta": "WIN_HOME|WIN_AWAY|DRAW|OVER|UNDER",
  "resultado": "HOME|AWAY|DRAW|OVER|UNDER",
  "valor": 2.15,
  "descripcion": "String",
  "activo": true,
  "fuente": "CALCULADO|MANUAL|API_EXTERNA",
  "fechaVencimiento": "DateTime",
  "eventoDeportivoId": 123
}
```

## Configuración

### Dependencias Maven Requeridas
```xml
<!-- WebSocket Support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### Properties de Aplicación
```properties
# WebSocket Configuration
spring.websocket.allowed-origins=*

# Scheduling
spring.task.scheduling.pool.size=5
```

## Uso en Frontend

### React/Next.js Ejemplo
```javascript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const useEventosDeportivos = () => {
  const [eventos, setEventos] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // Conectar WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
      
      // Suscribirse a actualizaciones
      client.subscribe('/topic/momios-actualizados', (message) => {
        const data = JSON.parse(message.body);
        if (data.tipo === 'MOMIOS_ACTUALIZADOS') {
          setEventos(data.eventos);
        }
      });
    });

    return () => {
      if (client) client.disconnect();
    };
  }, []);

  return { eventos, stompClient };
};
```

### React Native Ejemplo
```javascript
import { useEffect, useState } from 'react';

const useEventosEnVivo = () => {
  const [eventosEnVivo, setEventosEnVivo] = useState([]);

  const fetchEventosEnVivo = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/eventos-deportivos/en-vivo');
      const data = await response.json();
      if (data.success) {
        setEventosEnVivo(data.data);
      }
    } catch (error) {
      console.error('Error al obtener eventos en vivo:', error);
    }
  };

  useEffect(() => {
    fetchEventosEnVivo();
    const interval = setInterval(fetchEventosEnVivo, 30000); // Actualizar cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  return eventosEnVivo;
};
```

## Documentación Swagger

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación completa en:
```
http://localhost:8080/swagger-ui.html
```

## Estados de Eventos

- `Not Started`: Evento no iniciado
- `Live`: Evento en vivo
- `1H`: Primer tiempo
- `2H`: Segundo tiempo
- `HT`: Medio tiempo
- `Match Finished`: Partido terminado

## Tipos de Apuesta Disponibles

- `WIN_HOME`: Victoria local
- `WIN_AWAY`: Victoria visitante
- `DRAW`: Empate
- `OVER`: Más de X goles
- `UNDER`: Menos de X goles

## Consideraciones de Rendimiento

- Los eventos se actualizan cada 30 segundos vía WebSocket
- Use paginación para listas grandes de eventos
- Considere implementar cache para consultas frecuentes
- Los momios críticos se notifican inmediatamente

## Seguridad

- Configure CORS apropiadamente en producción
- Implemente autenticación JWT si es necesario
- Valide todas las entradas de usuario
- Use HTTPS en producción