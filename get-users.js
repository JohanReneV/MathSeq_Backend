#!/usr/bin/env node

/**
 * Script para obtener todos los usuarios de la base de datos
 */

import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno primero
dotenv.config();

// Importar después de configurar dotenv
import { UsuarioService } from "./services/UsuarioService.js";

async function getUsers() {
  try {
    console.log("🔍 Obteniendo usuarios de la base de datos...\n");

    const usuarioService = new UsuarioService();
    const users = await usuarioService.getAllUsers();

    console.log(`📊 Total de usuarios: ${users.length}\n`);
    console.log("📋 Usuarios en la base de datos:");
    console.log(JSON.stringify(users, null, 2));

    console.log("\n📊 Resumen de usuarios:");
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id} | Nombre: ${user.nombre} | Email: ${user.correo} | Rol: ${user.id_rol}`);
    });

  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error);
  }
}

// Ejecutar
getUsers();
