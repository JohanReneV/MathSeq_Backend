import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js";
import { logger } from "../utils/index.js";
import config from "../config/index.js";
import { AppError } from "../utils/errors.js";

/**
 * Service para manejo de lógica de negocio de usuarios
 * Contiene toda la lógica de negocio separada de los controladores
 */
export class UsuarioService {
  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async registerUser(userData) {
    const { nombre, correo, contrasena, id_rol } = userData;

    // Validar que el email no exista
    const existingUser = await this.usuarioRepository.findByEmail(correo);
    if (existingUser) {
      throw new AppError('El usuario ya existe con este email', 400);
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, config.security.bcryptRounds);

    // Crear usuario
    const userDataToSave = {
      nombre,
      correo,
      contrasena: hashedPassword,
      id_rol
    };

    const result = await this.usuarioRepository.create(userDataToSave);
    
    logger.info(`Usuario registrado exitosamente: ${correo}`);
    
    return {
      id: result.id,
      nombre,
      correo,
      id_rol,
      message: 'Usuario registrado exitosamente'
    };
  }

  /**
   * Autentica un usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario y token JWT
   */
  async authenticateUser(email, password) {
    // Buscar usuario por email
    const user = await this.usuarioRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.contrasena);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Generar token JWT
    const token = this.generateJWT(user);

    logger.info(`Usuario autenticado exitosamente: ${email}`);

    return {
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        id_rol: user.id_rol
      },
      token,
      message: 'Autenticación exitosa'
    };
  }

  /**
   * Obtiene todos los usuarios
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsers(options = {}) {
    const users = await this.usuarioRepository.findAll(options);
    
    // Remover contraseñas de la respuesta
    return users.map(user => ({
      id: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      id_rol: user.id_rol
    }));
  }

  /**
   * Obtiene un usuario por ID
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Usuario encontrado
   */
  async getUserById(userId) {
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return {
      id: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      id_rol: user.id_rol
    };
  }

  /**
   * Actualiza un usuario
   * @param {number} userId - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(userId, updateData) {
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // Si se está actualizando el email, verificar que no exista
    if (updateData.correo && updateData.correo !== user.correo) {
      const existingUser = await this.usuarioRepository.findByEmail(updateData.correo);
      if (existingUser) {
        throw new AppError('El email ya está en uso', 400);
      }
    }

    // Si se está actualizando la contraseña, encriptarla
    if (updateData.contrasena) {
      updateData.contrasena = await bcrypt.hash(updateData.contrasena, config.security.bcryptRounds);
    }

    const result = await this.usuarioRepository.updateById(userId, updateData);
    
    if (result.affectedRows === 0) {
      throw new AppError('No se pudo actualizar el usuario', 500);
    }

    logger.info(`Usuario actualizado: ${userId}`);

    return {
      id: userId,
      message: 'Usuario actualizado exitosamente'
    };
  }

  /**
   * Elimina un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteUser(userId) {
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const result = await this.usuarioRepository.deleteById(userId);
    
    if (result.affectedRows === 0) {
      throw new AppError('No se pudo eliminar el usuario', 500);
    }

    logger.info(`Usuario eliminado: ${userId}`);

    return {
      message: 'Usuario eliminado exitosamente'
    };
  }

  /**
   * Genera un token JWT para el usuario
   * @param {Object} user - Datos del usuario
   * @returns {string} Token JWT
   */
  generateJWT(user) {
    const payload = {
      id: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      id_rol: user.id_rol
    };

    return jwt.sign(payload, config.security.jwtSecret, {
      expiresIn: '24h',
      issuer: 'mathseq-backend'
    });
  }

  /**
   * Verifica un token JWT
   * @param {string} token - Token JWT
   * @returns {Promise<Object>} Datos del usuario del token
   */
  async verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, config.security.jwtSecret);
      
      // Verificar que el usuario aún existe
      const user = await this.usuarioRepository.findById(decoded.id);
      if (!user) {
        throw new AppError('Usuario no encontrado', 401);
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Token inválido', 401);
      }
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de usuarios
   * @returns {Promise<Object>} Estadísticas
   */
  async getUserStats() {
    return await this.usuarioRepository.getStats();
  }
}
