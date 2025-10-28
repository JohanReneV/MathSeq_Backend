import fs from 'fs';
import path from 'path';

// Utilidades para logging
export const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp} - ${message}`, data ? JSON.stringify(data) : '');
  },
  
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp} - ${message}`, error ? error.stack : '');
  },
  
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp} - ${message}`, data ? JSON.stringify(data) : '');
  },
  
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[DEBUG] ${timestamp} - ${message}`, data ? JSON.stringify(data) : '');
    }
  }
};

// Utilidades para validación
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  password: (password) => {
    return password && password.length >= 6;
  },
  
  required: (value) => {
    return value !== null && value !== undefined && value !== '';
  }
};

// Utilidades para respuestas HTTP
export const responses = {
  success: (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  },
  
  error: (res, message = 'Error interno del servidor', statusCode = 500, error = null) => {
    res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
      timestamp: new Date().toISOString()
    });
  },
  
  validationError: (res, errors) => {
    res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors,
      timestamp: new Date().toISOString()
    });
  }
};

// Utilidades para base de datos
export const dbUtils = {
  escape: (value) => {
    if (typeof value === 'string') {
      return value.replace(/'/g, "''");
    }
    return value;
  },
  
  buildWhereClause: (conditions) => {
    const clauses = [];
    const values = [];
    
    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        clauses.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    return {
      clause: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
      values
    };
  }
};
