/**
 * Clase base para errores personalizados de la aplicación
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error específico para validación de datos
 */
export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, errors);
    this.name = 'ValidationError';
  }
}

/**
 * Error específico para autenticación
 */
export class AuthenticationError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error específico para autorización
 */
export class AuthorizationError extends AppError {
  constructor(message = 'No tienes permisos para realizar esta acción') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Error específico para recursos no encontrados
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Error específico para conflictos (duplicados, etc.)
 */
export class ConflictError extends AppError {
  constructor(message = 'Conflicto de datos') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * Error específico para límites de tasa excedidos
 */
export class RateLimitError extends AppError {
  constructor(message = 'Demasiadas solicitudes') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}
