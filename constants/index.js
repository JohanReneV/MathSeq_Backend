/**
 * Constantes de la aplicación MathSEQ
 */

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 1,
  PROFESSOR: 2,
  STUDENT: 3
};

export const USER_ROLE_NAMES = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.PROFESSOR]: 'Profesor',
  [USER_ROLES.STUDENT]: 'Estudiante'
};

// Estados de respuesta HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

// Mensajes de respuesta estándar
export const RESPONSE_MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'Usuario creado exitosamente',
    USER_UPDATED: 'Usuario actualizado exitosamente',
    USER_DELETED: 'Usuario eliminado exitosamente',
    LOGIN_SUCCESS: 'Autenticación exitosa',
    MODULO_CREATED: 'Módulo creado exitosamente',
    MODULO_UPDATED: 'Módulo actualizado exitosamente',
    MODULO_DELETED: 'Módulo eliminado exitosamente',
    MODULOS_REORDERED: 'Módulos reordenados exitosamente'
  },
  ERROR: {
    VALIDATION_ERROR: 'Errores de validación',
    USER_NOT_FOUND: 'Usuario no encontrado',
    USER_ALREADY_EXISTS: 'El usuario ya existe',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'No tienes permisos para realizar esta acción',
    MODULO_NOT_FOUND: 'Módulo no encontrado',
    MODULO_ALREADY_EXISTS: 'Ya existe un módulo con este nombre',
    INTERNAL_ERROR: 'Error interno del servidor',
    RATE_LIMIT_EXCEEDED: 'Demasiadas solicitudes'
  }
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1
};

// Configuración de autenticación
export const AUTH_CONFIG = {
  JWT_EXPIRES_IN: '24h',
  BCRYPT_ROUNDS: 10,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000 // 15 minutos
};

// Configuración de rate limiting
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutos
  MAX_REQUESTS: process.env.NODE_ENV === 'production' ? 1000 : 100, // más permisivo en producción
  REGISTER_MAX_REQUESTS: process.env.NODE_ENV === 'production' ? 10 : 3 // más registros en producción
  // LOGIN_MAX_REQUESTS removido - sin límites para login
};

// Campos de ordenamiento permitidos
export const ALLOWED_ORDER_FIELDS = {
  USUARIOS: ['nombre', 'correo', 'id_rol', 'id_usuario'],
  MODULOS: ['nombre_modulo', 'orden', 'id_modulo']
};

// Configuración de logging
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// Configuración de CORS
export const CORS_CONFIG = {
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Configuración de validación
export const VALIDATION_LIMITS = {
  USER: {
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 255,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 128
  },
  MODULO: {
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
    ORDER_MIN_VALUE: 1
  },
  SEARCH: {
    TERM_MAX_LENGTH: 100
  }
};

// Configuración de base de datos
export const DB_CONFIG = {
  CONNECTION_TIMEOUT: 10000,
  ACQUIRE_TIMEOUT: 10000,
  TIMEOUT: 10000,
  RECONNECT: true,
  MAX_RECONNECT_ATTEMPTS: 3
};
