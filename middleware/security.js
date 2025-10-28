import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { UsuarioService } from "../services/UsuarioService.js";
import { logger } from "../utils/logger.js";
import { AppError, AuthenticationError, AuthorizationError } from "../utils/errors.js";
import { RATE_LIMIT_CONFIG, USER_ROLES } from "../constants/index.js";

/**
 * Middleware de autenticación JWT
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Token de acceso requerido');
    }

    const usuarioService = new UsuarioService();
    const decoded = await usuarioService.verifyJWT(token);
    
    // Agregar información del usuario al request
    req.user = decoded;
    req.userId = decoded.id;
    
    logger.audit('Token verificado', decoded.id, { 
      endpoint: req.path, 
      method: req.method 
    });
    
    next();
  } catch (error) {
    logger.security('Token inválido', { 
      error: error.message, 
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(401).json({
      success: false,
      error: 'Token inválido',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Middleware de autorización por roles
 */
export const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado',
        timestamp: new Date().toISOString()
      });
    }

    if (!allowedRoles.includes(req.user.id_rol)) {
      logger.security('Acceso denegado por rol', {
        userId: req.user.id,
        userRole: req.user.id_rol,
        requiredRoles: allowedRoles,
        endpoint: req.path,
        method: req.method
      });
      
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso',
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

/**
 * Middleware para verificar que el usuario puede acceder a su propio recurso
 */
export const authorizeOwnResource = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Usuario no autenticado',
      timestamp: new Date().toISOString()
    });
  }

  const resourceUserId = parseInt(req.params.userId || req.params.id);
  const currentUserId = req.user.id;

  // Los administradores pueden acceder a cualquier recurso
  if (req.user.id_rol === USER_ROLES.ADMIN) {
    return next();
  }

  // Los usuarios solo pueden acceder a sus propios recursos
  if (resourceUserId !== currentUserId) {
    logger.security('Acceso denegado a recurso de otro usuario', {
      currentUserId,
      resourceUserId,
      endpoint: req.path,
      method: req.method
    });
    
    return res.status(403).json({
      success: false,
      error: 'No tienes permisos para acceder a este recurso',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

/**
 * Rate limiting general
 */
export const generalRateLimit = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.MAX_REQUESTS,
  message: {
    success: false,
    error: 'Demasiadas solicitudes, intenta de nuevo más tarde',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.security('Rate limit excedido', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path
    });
    
    res.status(429).json({
      success: false,
      error: 'Demasiadas solicitudes, intenta de nuevo más tarde',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Rate limiting para login
 */
export const loginRateLimit = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.LOGIN_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Demasiados intentos de login, intenta de nuevo más tarde',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar requests exitosos
  handler: (req, res) => {
    logger.security('Rate limit de login excedido', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email: req.body?.correo || req.query?.correo
    });
    
    res.status(429).json({
      success: false,
      error: 'Demasiados intentos de login, intenta de nuevo más tarde',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Rate limiting para registro
 */
export const registerRateLimit = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.REGISTER_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Demasiados intentos de registro, intenta de nuevo más tarde',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.security('Rate limit de registro excedido', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email: req.body?.correo
    });
    
    res.status(429).json({
      success: false,
      error: 'Demasiados intentos de registro, intenta de nuevo más tarde',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Middleware de seguridad con Helmet
 */
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
});

/**
 * Middleware para logging de requests HTTP
 */
export const httpLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Interceptar el método end de la respuesta
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - startTime;
    logger.http(req, res, responseTime);
    originalEnd.apply(this, args);
  };
  
  next();
};

/**
 * Middleware para validar que el usuario existe
 */
export const validateUserExists = async (req, res, next) => {
  try {
    const usuarioService = new UsuarioService();
    const userId = parseInt(req.params.userId || req.params.id);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'ID de usuario requerido',
        timestamp: new Date().toISOString()
      });
    }

    const user = await usuarioService.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
        timestamp: new Date().toISOString()
      });
    }

    req.targetUser = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      timestamp: new Date().toISOString()
    });
  }
};
