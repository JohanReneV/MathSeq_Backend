import dotenv from "dotenv";

dotenv.config();

const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost"
  },
  
  // Configuración de la base de datos
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  },
  
  // Configuración de seguridad
  security: {
    bcryptRounds: 10,
    jwtSecret: process.env.JWT_SECRET || (() => {
      console.warn('⚠️  ADVERTENCIA: JWT_SECRET no configurado, usando valor por defecto inseguro');
      return "default-jwt-secret-change-in-production";
    })()
  },
  
  // Configuración de CORS
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
  }
};

export default config;
