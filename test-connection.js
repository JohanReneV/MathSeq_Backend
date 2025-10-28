#!/usr/bin/env node

/**
 * Script de prueba para verificar la conexión a la base de datos
 * y el flujo completo de la aplicación
 */

import dotenv from "dotenv";
import { UsuarioService } from "./services/UsuarioService.js";
import { logger } from "./utils/logger.js";

// Cargar variables de entorno
dotenv.config();

async function testConnection() {
  try {
    console.log("🧪 Iniciando pruebas de conexión...\n");

    // 1. Verificar variables de entorno
    console.log("1️⃣ Verificando variables de entorno:");
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error("❌ Variables de entorno faltantes:", missingVars);
      console.log("💡 Configura las variables en tu archivo .env");
      return;
    }
    console.log("✅ Variables de entorno configuradas\n");

    // 2. Probar conexión a base de datos
    console.log("2️⃣ Probando conexión a base de datos:");
    const usuarioService = new UsuarioService();
    
    // Intentar obtener estadísticas (esto requiere conexión a DB)
    try {
      const stats = await usuarioService.getUserStats();
      console.log("✅ Conexión a base de datos exitosa");
      console.log("📊 Estadísticas de usuarios:", stats);
    } catch (error) {
      console.error("❌ Error conectando a base de datos:", error.message);
      console.log("💡 Verifica que:");
      console.log("   - La base de datos esté ejecutándose");
      console.log("   - Las credenciales sean correctas");
      console.log("   - La tabla 'usuarios' exista");
      return;
    }

    // 3. Probar validación
    console.log("\n3️⃣ Probando validación de datos:");
    const { UsuarioValidator } = await import("./validators/UsuarioValidator.js");
    
    try {
      const validData = {
        nombre: "Test User",
        correo: "test@example.com",
        contrasena: "password123",
        id_rol: 1
      };
      
      const validated = UsuarioValidator.validateRegister(validData);
      console.log("✅ Validación de datos funcionando");
    } catch (error) {
      console.error("❌ Error en validación:", error.message);
    }

    // 4. Probar autenticación
    console.log("\n4️⃣ Probando autenticación:");
    try {
      // Intentar login con credenciales de prueba
      await usuarioService.authenticateUser("admin@mathseq.edu", "adminroot");
      console.log("✅ Autenticación funcionando");
    } catch (error) {
      if (error.message === "Credenciales inválidas") {
        console.log("⚠️  Usuario admin no existe, pero la autenticación funciona");
      } else {
        console.error("❌ Error en autenticación:", error.message);
      }
    }

    console.log("\n🎉 ¡Todas las pruebas completadas!");
    console.log("🚀 El backend está listo para recibir peticiones");

  } catch (error) {
    console.error("💥 Error general:", error);
  }
}

// Ejecutar pruebas
testConnection();
