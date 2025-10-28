import { ValidationError } from "../utils/errors.js";

/**
 * Validador para datos de usuario
 */
export class UsuarioValidator {
  /**
   * Valida datos de registro de usuario
   * @param {Object} data - Datos del usuario
   * @returns {Object} Datos validados
   */
  static validateRegister(data) {
    const errors = [];

    // Validar nombre
    if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
      errors.push('El nombre es requerido');
    } else if (data.nombre.length > 100) {
      errors.push('El nombre no puede exceder 100 caracteres');
    }

    // Validar email
    if (!data.correo || typeof data.correo !== 'string') {
      errors.push('El correo es requerido');
    } else if (!this.isValidEmail(data.correo)) {
      errors.push('El formato del correo no es válido');
    } else if (data.correo.length > 255) {
      errors.push('El correo no puede exceder 255 caracteres');
    }

    // Validar contraseña
    if (!data.contrasena || typeof data.contrasena !== 'string') {
      errors.push('La contraseña es requerida');
    } else if (data.contrasena.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    } else if (data.contrasena.length > 128) {
      errors.push('La contraseña no puede exceder 128 caracteres');
    }

    // Validar rol
    if (!data.id_rol || !Number.isInteger(Number(data.id_rol))) {
      errors.push('El rol es requerido y debe ser un número entero');
    } else if (data.id_rol < 1 || data.id_rol > 3) {
      errors.push('El rol debe ser un valor entre 1 y 3');
    }

    if (errors.length > 0) {
      throw new ValidationError('Errores de validación en registro de usuario', errors);
    }

    return {
      nombre: data.nombre.trim(),
      correo: data.correo.trim().toLowerCase(),
      contrasena: data.contrasena,
      id_rol: Number(data.id_rol)
    };
  }

  /**
   * Valida datos de login
   * @param {Object} data - Datos de login
   * @returns {Object} Datos validados
   */
  static validateLogin(data) {
    const errors = [];

    // Validar email
    if (!data.correo || typeof data.correo !== 'string') {
      errors.push('El correo es requerido');
    } else if (!this.isValidEmail(data.correo)) {
      errors.push('El formato del correo no es válido');
    }

    // Validar contraseña
    if (!data.contrasena || typeof data.contrasena !== 'string') {
      errors.push('La contraseña es requerida');
    }

    if (errors.length > 0) {
      throw new ValidationError('Errores de validación en login', errors);
    }

    return {
      correo: data.correo.trim().toLowerCase(),
      contrasena: data.contrasena
    };
  }

  /**
   * Valida datos de actualización de usuario
   * @param {Object} data - Datos a actualizar
   * @returns {Object} Datos validados
   */
  static validateUpdate(data) {
    const errors = [];
    const validatedData = {};

    // Validar nombre (opcional en actualización)
    if (data.nombre !== undefined) {
      if (typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
        errors.push('El nombre no puede estar vacío');
      } else if (data.nombre.length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
      } else {
        validatedData.nombre = data.nombre.trim();
      }
    }

    // Validar email (opcional en actualización)
    if (data.correo !== undefined) {
      if (typeof data.correo !== 'string') {
        errors.push('El correo debe ser una cadena de texto');
      } else if (!this.isValidEmail(data.correo)) {
        errors.push('El formato del correo no es válido');
      } else if (data.correo.length > 255) {
        errors.push('El correo no puede exceder 255 caracteres');
      } else {
        validatedData.correo = data.correo.trim().toLowerCase();
      }
    }

    // Validar contraseña (opcional en actualización)
    if (data.contrasena !== undefined) {
      if (typeof data.contrasena !== 'string') {
        errors.push('La contraseña debe ser una cadena de texto');
      } else if (data.contrasena.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      } else if (data.contrasena.length > 128) {
        errors.push('La contraseña no puede exceder 128 caracteres');
      } else {
        validatedData.contrasena = data.contrasena;
      }
    }

    // Validar rol (opcional en actualización)
    if (data.id_rol !== undefined) {
      if (!Number.isInteger(Number(data.id_rol))) {
        errors.push('El rol debe ser un número entero');
      } else if (data.id_rol < 1 || data.id_rol > 3) {
        errors.push('El rol debe ser un valor entre 1 y 3');
      } else {
        validatedData.id_rol = Number(data.id_rol);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Errores de validación en actualización de usuario', errors);
    }

    return validatedData;
  }

  /**
   * Valida formato de email
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida ID de usuario
   * @param {any} id - ID a validar
   * @returns {number} ID validado
   */
  static validateUserId(id) {
    const userId = Number(id);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError('ID de usuario inválido');
    }
    return userId;
  }
}
