import Joi from 'joi';
import { USER_ROLES, VALIDATION_LIMITS } from '../constants/index.js';

/**
 * Esquemas de validación usando Joi
 */

// Esquema base para validación de ID
export const idSchema = Joi.number().integer().positive().required();

// Esquemas para usuarios
export const usuarioSchemas = {
  // Esquema para registro de usuario
  register: Joi.object({
    nombre: Joi.string()
      .trim()
      .min(1)
      .max(VALIDATION_LIMITS.USER.NAME_MAX_LENGTH)
      .required()
      .messages({
        'string.empty': 'El nombre es requerido',
        'string.min': 'El nombre no puede estar vacío',
        'string.max': `El nombre no puede exceder ${VALIDATION_LIMITS.USER.NAME_MAX_LENGTH} caracteres`
      }),
    
    correo: Joi.string()
      .email()
      .trim()
      .lowercase()
      .max(VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH)
      .required()
      .messages({
        'string.email': 'El formato del correo no es válido',
        'string.empty': 'El correo es requerido',
        'string.max': `El correo no puede exceder ${VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH} caracteres`
      }),
    
    contrasena: Joi.string()
      .min(VALIDATION_LIMITS.USER.PASSWORD_MIN_LENGTH)
      .max(VALIDATION_LIMITS.USER.PASSWORD_MAX_LENGTH)
      .required()
      .messages({
        'string.min': `La contraseña debe tener al menos ${VALIDATION_LIMITS.USER.PASSWORD_MIN_LENGTH} caracteres`,
        'string.max': `La contraseña no puede exceder ${VALIDATION_LIMITS.USER.PASSWORD_MAX_LENGTH} caracteres`,
        'string.empty': 'La contraseña es requerida'
      }),
    
    id_rol: Joi.number()
      .integer()
      .valid(...Object.values(USER_ROLES))
      .required()
      .messages({
        'any.only': 'El rol debe ser un valor válido (1: Admin, 2: Profesor, 3: Estudiante)',
        'number.base': 'El rol debe ser un número'
      })
  }),

  // Esquema para login de usuario
  login: Joi.object({
    correo: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        'string.email': 'El formato del correo no es válido',
        'string.empty': 'El correo es requerido'
      }),
    
    contrasena: Joi.string()
      .required()
      .messages({
        'string.empty': 'La contraseña es requerida'
      })
  }),

  // Esquema para actualización de usuario
  update: Joi.object({
    nombre: Joi.string()
      .trim()
      .min(1)
      .max(VALIDATION_LIMITS.USER.NAME_MAX_LENGTH)
      .optional()
      .messages({
        'string.min': 'El nombre no puede estar vacío',
        'string.max': `El nombre no puede exceder ${VALIDATION_LIMITS.USER.NAME_MAX_LENGTH} caracteres`
      }),
    
    correo: Joi.string()
      .email()
      .trim()
      .lowercase()
      .max(VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH)
      .optional()
      .messages({
        'string.email': 'El formato del correo no es válido',
        'string.max': `El correo no puede exceder ${VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH} caracteres`
      }),
    
    contrasena: Joi.string()
      .min(VALIDATION_LIMITS.USER.PASSWORD_MIN_LENGTH)
      .max(VALIDATION_LIMITS.USER.PASSWORD_MAX_LENGTH)
      .optional()
      .messages({
        'string.min': `La contraseña debe tener al menos ${VALIDATION_LIMITS.USER.PASSWORD_MIN_LENGTH} caracteres`,
        'string.max': `La contraseña no puede exceder ${VALIDATION_LIMITS.USER.PASSWORD_MAX_LENGTH} caracteres`
      }),
    
    id_rol: Joi.number()
      .integer()
      .valid(...Object.values(USER_ROLES))
      .optional()
      .messages({
        'any.only': 'El rol debe ser un valor válido (1: Admin, 2: Profesor, 3: Estudiante)',
        'number.base': 'El rol debe ser un número'
      })
  }).min(1).messages({
    'object.min': 'Se debe proporcionar al menos un campo para actualizar'
  })
};

// Esquemas para módulos
export const moduloSchemas = {
  // Esquema para creación de módulo
  create: Joi.object({
    nombre: Joi.string()
      .trim()
      .min(1)
      .max(VALIDATION_LIMITS.MODULO.NAME_MAX_LENGTH)
      .required()
      .messages({
        'string.empty': 'El nombre del módulo es requerido',
        'string.min': 'El nombre del módulo no puede estar vacío',
        'string.max': `El nombre del módulo no puede exceder ${VALIDATION_LIMITS.MODULO.NAME_MAX_LENGTH} caracteres`
      }),
    
    descripcion: Joi.string()
      .trim()
      .max(VALIDATION_LIMITS.MODULO.DESCRIPTION_MAX_LENGTH)
      .allow('')
      .optional()
      .messages({
        'string.max': `La descripción no puede exceder ${VALIDATION_LIMITS.MODULO.DESCRIPTION_MAX_LENGTH} caracteres`
      }),
    
    orden: Joi.number()
      .integer()
      .min(VALIDATION_LIMITS.MODULO.ORDER_MIN_VALUE)
      .optional()
      .messages({
        'number.min': `El orden debe ser mayor o igual a ${VALIDATION_LIMITS.MODULO.ORDER_MIN_VALUE}`,
        'number.base': 'El orden debe ser un número entero'
      })
  }),

  // Esquema para actualización de módulo
  update: Joi.object({
    nombre: Joi.string()
      .trim()
      .min(1)
      .max(VALIDATION_LIMITS.MODULO.NAME_MAX_LENGTH)
      .optional()
      .messages({
        'string.min': 'El nombre del módulo no puede estar vacío',
        'string.max': `El nombre del módulo no puede exceder ${VALIDATION_LIMITS.MODULO.NAME_MAX_LENGTH} caracteres`
      }),
    
    descripcion: Joi.string()
      .trim()
      .max(VALIDATION_LIMITS.MODULO.DESCRIPTION_MAX_LENGTH)
      .allow('')
      .optional()
      .messages({
        'string.max': `La descripción no puede exceder ${VALIDATION_LIMITS.MODULO.DESCRIPTION_MAX_LENGTH} caracteres`
      }),
    
    orden: Joi.number()
      .integer()
      .min(VALIDATION_LIMITS.MODULO.ORDER_MIN_VALUE)
      .optional()
      .messages({
        'number.min': `El orden debe ser mayor o igual a ${VALIDATION_LIMITS.MODULO.ORDER_MIN_VALUE}`,
        'number.base': 'El orden debe ser un número entero'
      })
  }).min(1).messages({
    'object.min': 'Se debe proporcionar al menos un campo para actualizar'
  }),

  // Esquema para reordenamiento de módulos
  reorder: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .unique()
    .required()
    .messages({
      'array.min': 'Se requiere al menos un ID para reordenar',
      'array.unique': 'No se permiten IDs duplicados',
      'number.base': 'Los IDs deben ser números enteros positivos'
    })
};

// Esquemas para consultas y paginación
export const querySchemas = {
  // Esquema para parámetros de paginación
  pagination: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    orderBy: Joi.string().valid('nombre', 'correo', 'id_rol', 'id_usuario', 'nombre_modulo', 'orden', 'id_modulo').optional(),
    orderDirection: Joi.string().valid('ASC', 'DESC').optional()
  }),

  // Esquema para búsqueda
  search: Joi.object({
    q: Joi.string()
      .trim()
      .max(VALIDATION_LIMITS.SEARCH.TERM_MAX_LENGTH)
      .optional()
      .messages({
        'string.max': `El término de búsqueda no puede exceder ${VALIDATION_LIMITS.SEARCH.TERM_MAX_LENGTH} caracteres`
      })
  })
};

// Función helper para validar datos con Joi
export const validateData = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    throw new Error(`Errores de validación: ${errors.join(', ')}`);
  }

  return value;
};
