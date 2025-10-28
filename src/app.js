import express from "express";
import dotenv from "dotenv";
import config from "../config/index.js";
import routes from "../routes/index.js";
import { corsMiddleware, corsErrorHandler } from "../middleware/cors.js";
import { 
  generalRateLimit,
  securityMiddleware,
  httpLogger
} from "../middleware/security.js";
import { AppError } from "../utils/errors.js";

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middleware de seguridad
app.use(securityMiddleware);

// Middleware global
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting general
app.use(generalRateLimit);

// Logging de requests HTTP
app.use(httpLogger);

// Rutas principales
app.use("/api", routes);

// Ruta de salud del servidor
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || 'development',
    rateLimitConfig: {
      maxRequests: process.env.NODE_ENV === 'production' ? 1000 : 100,
      loginMaxRequests: 'Sin límites',
      windowMs: 15 * 60 * 1000
    }
  });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🚀 Backend MathSEQ v2.0 funcionando - Arquitectura MVC + Services + Repository");
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: "Ruta no encontrada",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use(corsErrorHandler);

// Middleware de manejo de errores personalizado
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
      timestamp: new Date().toISOString()
    });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ 
      success: false,
      error: "El registro ya existe",
      timestamp: new Date().toISOString()
    });
  }

  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({ 
      success: false,
      error: "Error de configuración de base de datos",
      timestamp: new Date().toISOString()
    });
  }

  res.status(500).json({ 
    success: false,
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const PORT = process.env.PORT || config.server.port;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : config.server.host;

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor MathSEQ v2.0 corriendo en http://${HOST}:${PORT}`);
  console.log(`📊 Health check disponible en http://${HOST}:${PORT}/health`);
  console.log(`🔒 Arquitectura: MVC + Services + Repository`);
  console.log(`🛡️ Seguridad: JWT + Rate Limiting + Helmet`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Promesa rechazada no manejada:', err);
  process.exit(1);
});

export default app;
