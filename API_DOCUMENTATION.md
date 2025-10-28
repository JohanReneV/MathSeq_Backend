# MathSEQ Backend v2.0 - Documentación de API

## 🚀 Arquitectura Implementada

### Patrón MVC + Services + Repository
- **Models**: Entidades de datos con validaciones
- **Views**: Respuestas JSON estructuradas
- **Controllers**: Manejo de requests/responses
- **Services**: Lógica de negocio
- **Repositories**: Acceso a datos

### Características de Seguridad
- ✅ **JWT Authentication**: Tokens seguros con expiración
- ✅ **Role-based Authorization**: Control de acceso por roles
- ✅ **Rate Limiting**: Protección contra ataques de fuerza bruta
- ✅ **Helmet**: Headers de seguridad HTTP
- ✅ **CORS**: Configuración segura de origen cruzado
- ✅ **Input Validation**: Validación robusta con Joi
- ✅ **Error Handling**: Manejo centralizado de errores

## 📋 Endpoints Disponibles

### 🔐 Autenticación

#### POST `/api/usuarios/register`
Registra un nuevo usuario.

**Rate Limit**: 3 requests por 15 minutos

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@ejemplo.com",
  "contrasena": "password123",
  "id_rol": 3
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@ejemplo.com",
    "id_rol": 3
  },
  "timestamp": "2025-10-20T03:30:00.000Z"
}
```

#### POST `/api/usuarios/login`
Autentica un usuario y devuelve un token JWT.

**Rate Limit**: 5 requests por 15 minutos

**Body:**
```json
{
  "correo": "juan@ejemplo.com",
  "contrasena": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Juan Pérez",
      "correo": "juan@ejemplo.com",
      "id_rol": 3
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-10-20T03:30:00.000Z"
}
```

### 👥 Gestión de Usuarios

#### GET `/api/usuarios`
Obtiene todos los usuarios (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `orderBy`: Campo de ordenamiento (nombre, correo, id_rol)
- `limit`: Número de resultados (1-100)
- `offset`: Desplazamiento para paginación

#### GET `/api/usuarios/:id`
Obtiene un usuario específico por ID.

#### PUT `/api/usuarios/:id`
Actualiza un usuario (solo propietario o admin).

#### DELETE `/api/usuarios/:id`
Elimina un usuario (solo administradores).

#### GET `/api/usuarios/stats`
Obtiene estadísticas de usuarios (solo administradores).

### 📚 Gestión de Módulos

#### GET `/api/modulos`
Obtiene todos los módulos ordenados.

#### GET `/api/modulos/:id`
Obtiene un módulo específico por ID.

#### POST `/api/modulos`
Crea un nuevo módulo (requiere autenticación + rol profesor/admin).

**Body:**
```json
{
  "nombre": "Álgebra Lineal",
  "descripcion": "Fundamentos de álgebra lineal",
  "orden": 1
}
```

#### PUT `/api/modulos/:id`
Actualiza un módulo (requiere autenticación + rol profesor/admin).

#### DELETE `/api/modulos/:id`
Elimina un módulo (solo administradores).

#### GET `/api/modulos/search?q=termino`
Busca módulos por nombre.

#### POST `/api/modulos/reorder`
Reordena los módulos (requiere autenticación + rol profesor/admin).

**Body:**
```json
[1, 3, 2, 4]
```

#### GET `/api/modulos/stats`
Obtiene estadísticas de módulos.

### 🏥 Sistema

#### GET `/health`
Health check del servidor.

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-20T03:30:00.000Z",
  "uptime": 123.456,
  "version": "2.0.0",
  "environment": "development"
}
```

## 🔒 Roles y Permisos

### Roles Disponibles
- **1 - Administrador**: Acceso completo al sistema
- **2 - Profesor**: Puede gestionar módulos y ver usuarios
- **3 - Estudiante**: Solo lectura de módulos

### Matriz de Permisos

| Acción | Admin | Profesor | Estudiante |
|--------|-------|----------|------------|
| Ver módulos | ✅ | ✅ | ✅ |
| Crear módulos | ✅ | ✅ | ❌ |
| Editar módulos | ✅ | ✅ | ❌ |
| Eliminar módulos | ✅ | ❌ | ❌ |
| Ver usuarios | ✅ | ✅ | ❌ |
| Crear usuarios | ✅ | ❌ | ❌ |
| Editar usuarios | ✅ | ❌ | ❌ |
| Eliminar usuarios | ✅ | ❌ | ❌ |
| Ver estadísticas | ✅ | ❌ | ❌ |

## 🛡️ Seguridad

### Rate Limiting
- **General**: 100 requests por 15 minutos
- **Login**: 5 intentos por 15 minutos
- **Registro**: 3 intentos por 15 minutos

### Headers de Seguridad
- **Helmet**: Configurado con CSP y otros headers
- **CORS**: Orígenes permitidos configurados
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY

### Validación de Datos
- **Joi Schemas**: Validación robusta de entrada
- **Sanitización**: Limpieza automática de datos
- **Límites**: Longitud máxima de campos definida

## 📊 Logging y Monitoreo

### Niveles de Log
- **ERROR**: Errores críticos del sistema
- **WARN**: Advertencias y eventos de seguridad
- **INFO**: Información general de operaciones
- **DEBUG**: Información detallada (solo desarrollo)
- **AUDIT**: Registro de acciones importantes
- **SECURITY**: Eventos de seguridad

### Archivos de Log
- `logs/error.log`: Errores del sistema
- `logs/warn.log`: Advertencias
- `logs/info.log`: Información general
- `logs/debug.log`: Debug (desarrollo)
- `logs/audit.log`: Auditoría
- `logs/security.log`: Eventos de seguridad

## 🚀 Instalación y Uso

### Requisitos
- Node.js >= 18.0.0
- MySQL 8.0+
- npm o yarn

### Instalación
```bash
npm install
```

### Configuración
1. Copia `.env.example` a `.env`
2. Configura las variables de base de datos
3. Establece `JWT_SECRET` seguro

### Ejecución
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📈 Próximas Mejoras

- [ ] Tests unitarios y de integración
- [ ] Documentación con Swagger/OpenAPI
- [ ] Dockerización
- [ ] CI/CD pipeline
- [ ] Métricas y monitoreo avanzado
- [ ] Cache con Redis
- [ ] WebSockets para tiempo real
- [ ] Backup automático de base de datos
