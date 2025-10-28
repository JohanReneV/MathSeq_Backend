import cors from "cors";
import config from "../config/index.js";

// Configuración de CORS
export const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = config.cors.origin.split(',');
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware de CORS
export const corsMiddleware = cors(corsOptions);

// Middleware para manejar errores de CORS
export const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'No permitido por CORS') {
    res.status(403).json({ error: 'Acceso denegado por política CORS' });
  } else {
    next(err);
  }
};
