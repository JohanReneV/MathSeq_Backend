import { ValidationError } from "../utils/errors.js";

/**
 * Validador para datos de módulos
 */
export class ModuloValidator {
  /**
   * Valida datos de creación de módulo
   * @param {Object} data - Datos del módulo
   * @returns {Object} Datos validados
   */
  static validateCreate(data) {
    const errors = [];

    // Validar nombre
    if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
      errors.push('El nombre del módulo es requerido');
    } else if (data.nombre.length > 100) {
      errors.push('El nombre del módulo no puede exceder 100 caracteres');
    }

    // Validar descripción (opcional)
    if (data.descripcion !== undefined) {
      if (typeof data.descripcion !== 'string') {
        errors.push('La descripción debe ser una cadena de texto');
      } else if (data.descripcion.length > 500) {
        errors.push('La descripción no puede exceder 500 caracteres');
      }
    }

    // Validar orden (opcional)
    if (data.orden !== undefined) {
      if (!Number.isInteger(Number(data.orden)) || Number(data.orden) < 1) {
        errors.push('El orden debe ser un número entero positivo');
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Errores de validación en creación de módulo', errors);
    }

    return {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion ? data.descripcion.trim() : '',
      orden: data.orden ? Number(data.orden) : undefined
    };
  }

  /**
   * Valida datos de actualización de módulo
   * @param {Object} data - Datos a actualizar
   * @returns {Object} Datos validados
   */
  static validateUpdate(data) {
    const errors = [];
    const validatedData = {};

    // Validar nombre (opcional en actualización)
    if (data.nombre !== undefined) {
      if (typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
        errors.push('El nombre del módulo no puede estar vacío');
      } else if (data.nombre.length > 100) {
        errors.push('El nombre del módulo no puede exceder 100 caracteres');
      } else {
        validatedData.nombre = data.nombre.trim();
      }
    }

    // Validar descripción (opcional en actualización)
    if (data.descripcion !== undefined) {
      if (typeof data.descripcion !== 'string') {
        errors.push('La descripción debe ser una cadena de texto');
      } else if (data.descripcion.length > 500) {
        errors.push('La descripción no puede exceder 500 caracteres');
      } else {
        validatedData.descripcion = data.descripcion.trim();
      }
    }

    // Validar orden (opcional en actualización)
    if (data.orden !== undefined) {
      if (!Number.isInteger(Number(data.orden)) || Number(data.orden) < 1) {
        errors.push('El orden debe ser un número entero positivo');
      } else {
        validatedData.orden = Number(data.orden);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Errores de validación en actualización de módulo', errors);
    }

    return validatedData;
  }

  /**
   * Valida ID de módulo
   * @param {any} id - ID a validar
   * @returns {number} ID validado
   */
  static validateModuloId(id) {
    const moduloId = Number(id);
    if (!Number.isInteger(moduloId) || moduloId <= 0) {
      throw new ValidationError('ID de módulo inválido');
    }
    return moduloId;
  }

  /**
   * Valida array de IDs para reordenamiento
   * @param {Array} ids - Array de IDs
   * @returns {Array} Array de IDs validados
   */
  static validateReorderIds(ids) {
    if (!Array.isArray(ids)) {
      throw new ValidationError('Se requiere un array de IDs');
    }

    if (ids.length === 0) {
      throw new ValidationError('El array de IDs no puede estar vacío');
    }

    const validatedIds = ids.map(id => {
      const moduloId = Number(id);
      if (!Number.isInteger(moduloId) || moduloId <= 0) {
        throw new ValidationError(`ID inválido: ${id}`);
      }
      return moduloId;
    });

    // Verificar que no haya IDs duplicados
    const uniqueIds = [...new Set(validatedIds)];
    if (uniqueIds.length !== validatedIds.length) {
      throw new ValidationError('No se permiten IDs duplicados');
    }

    return validatedIds;
  }

  /**
   * Valida término de búsqueda
   * @param {string} searchTerm - Término de búsqueda
   * @returns {string} Término validado
   */
  static validateSearchTerm(searchTerm) {
    if (typeof searchTerm !== 'string') {
      throw new ValidationError('El término de búsqueda debe ser una cadena de texto');
    }

    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm.length > 100) {
      throw new ValidationError('El término de búsqueda no puede exceder 100 caracteres');
    }

    return trimmedTerm;
  }

  /**
   * Valida parámetros de paginación
   * @param {Object} params - Parámetros de paginación
   * @returns {Object} Parámetros validados
   */
  static validatePagination(params) {
    const errors = [];
    const validatedParams = {};

    // Validar página
    if (params.page !== undefined) {
      const page = Number(params.page);
      if (!Number.isInteger(page) || page < 1) {
        errors.push('La página debe ser un número entero mayor a 0');
      } else {
        validatedParams.page = page;
      }
    }

    // Validar límite
    if (params.limit !== undefined) {
      const limit = Number(params.limit);
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        errors.push('El límite debe ser un número entero entre 1 y 100');
      } else {
        validatedParams.limit = limit;
      }
    }

    // Validar ordenamiento
    if (params.orderBy !== undefined) {
      const allowedFields = ['nombre_modulo', 'orden', 'id_modulo'];
      if (!allowedFields.includes(params.orderBy)) {
        errors.push(`Campo de ordenamiento inválido. Campos permitidos: ${allowedFields.join(', ')}`);
      } else {
        validatedParams.orderBy = params.orderBy;
      }
    }

    // Validar dirección de ordenamiento
    if (params.orderDirection !== undefined) {
      const allowedDirections = ['ASC', 'DESC'];
      if (!allowedDirections.includes(params.orderDirection.toUpperCase())) {
        errors.push('Dirección de ordenamiento inválida. Valores permitidos: ASC, DESC');
      } else {
        validatedParams.orderDirection = params.orderDirection.toUpperCase();
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Errores de validación en parámetros de paginación', errors);
    }

    return validatedParams;
  }
}
