import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import config from '../config/index.js';

// Cargar env
dotenv.config();

async function main() {
  const nombre = 'Jhojan';
  const correo = 'momonga12@outlook.es';
  const contrasenaPlano = 'admin123';
  const id_rol = 3; // Rol actualizado a 3

  const repo = new UsuarioRepository();

  // Buscar por email
  const existing = await repo.findByEmail(correo);

  const hashed = await bcrypt.hash(contrasenaPlano, config.security.bcryptRounds);

  if (existing) {
    
    await repo.updateById(existing.id_usuario, {
      nombre,
      contrasena: hashed,
      id_rol
    });
    console.log(`✅ Usuario admin actualizado: ${correo} (id ${existing.id_usuario})`);
    return;
  }

  // Crear nuevo
  const result = await repo.create({ nombre, correo, contrasena: hashed, id_rol });
  console.log(`✅ Usuario admin creado: ${correo} (id ${result.id})`);
}

main().catch((err) => {
  console.error('❌ Error creando/actualizando admin:', err);
  process.exit(1);
});
