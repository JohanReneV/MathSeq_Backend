import { UsuarioService } from "../services/UsuarioService.js";
import { UsuarioValidator } from "../validators/UsuarioValidator.js";
import { logger } from "../utils/logger.js";
import { responses } from "../utils/index.js";
import { AppError } from "../utils/errors.js";

/**
 * Controlador para manejo de usuarios
 * Utiliza la capa de servicios para la lógica de negocio
 */
export class UsuarioController {
  constructor() {
    this.usuarioService = new UsuarioService();
  }

  /**
   * Obtener todos los usuarios
   */
  getUsuarios = async (req, res) => {
    try {
      const options = {
        orderBy: req.query.orderBy || 'nombre ASC',
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset) : undefined
      };

      const usuarios = await this.usuarioService.getAllUsers(options);
      
      logger.info('Usuarios obtenidos exitosamente', { 
        count: usuarios.length,
        userId: req.user?.id 
      });
      
      responses.success(res, usuarios, 'Usuarios obtenidos exitosamente');
    } catch (error) {
      logger.error('Error obteniendo usuarios:', error);
      responses.error(res, 'Error obteniendo usuarios', 500, error);
    }
  };

  /**
   * Registrar nuevo usuario
   */
  registerUsuario = async (req, res) => {
    try {
      // Validar datos de entrada
      const validatedData = UsuarioValidator.validateRegister(req.body);
      
      // Registrar usuario usando el servicio
      const result = await this.usuarioService.registerUser(validatedData);
      
      logger.audit('Usuario registrado', result.id, {
        email: result.correo,
        role: result.id_rol
      });
      
      responses.success(res, result, 'Usuario registrado exitosamente', 201);
    } catch (error) {
      logger.error('Error registrando usuario:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode, error.details);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Autenticar usuario (POST)
   */
  loginUsuario = async (req, res) => {
    try {
      // Validar que el body no esté vacío
      if (!req.body || Object.keys(req.body).length === 0) {
        return responses.error(res, 'Datos de login requeridos', 400);
      }

      // Validar datos de entrada
      const validatedData = UsuarioValidator.validateLogin(req.body);
      
      // Autenticar usuario usando el servicio
      const result = await this.usuarioService.authenticateUser(
        validatedData.correo, 
        validatedData.contrasena
      );
      
      logger.audit('Login exitoso', result.user.id, {
        email: result.user.correo,
        role: result.user.id_rol
      });
      
      responses.success(res, result, 'Autenticación exitosa');
    } catch (error) {
      logger.error('Error en login:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode, error.details);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Autenticar usuario (GET) - Para compatibilidad
   */
  loginUsuarioGet = async (req, res) => {
    try {
      // Validar que los query params existan
      if (!req.query.correo || !req.query.contrasena) {
        return responses.error(res, 'Parámetros de login requeridos (correo y contrasena)', 400);
      }

      // Convertir query params a formato de body
      const loginData = {
        correo: req.query.correo,
        contrasena: req.query.contrasena
      };
      
      // Validar datos de entrada
      const validatedData = UsuarioValidator.validateLogin(loginData);
      
      // Autenticar usuario usando el servicio
      const result = await this.usuarioService.authenticateUser(
        validatedData.correo, 
        validatedData.contrasena
      );
      
      logger.audit('Login exitoso (GET)', result.user.id, {
        email: result.user.correo,
        role: result.user.id_rol
      });
      
      responses.success(res, result, 'Autenticación exitosa');
    } catch (error) {
      logger.error('Error en login GET:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode, error.details);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Obtener usuario por ID
   */
  getUserById = async (req, res) => {
    try {
      const userId = UsuarioValidator.validateUserId(req.params.id);
      const user = await this.usuarioService.getUserById(userId);
      
      logger.info('Usuario obtenido por ID', { 
        userId,
        requestedBy: req.user?.id 
      });
      
      responses.success(res, user, 'Usuario obtenido exitosamente');
    } catch (error) {
      logger.error('Error obteniendo usuario por ID:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Actualizar usuario
   */
  updateUser = async (req, res) => {
    try {
      const userId = UsuarioValidator.validateUserId(req.params.id);
      const validatedData = UsuarioValidator.validateUpdate(req.body);
      
      const result = await this.usuarioService.updateUser(userId, validatedData);
      
      logger.audit('Usuario actualizado', userId, {
        updatedFields: Object.keys(validatedData),
        updatedBy: req.user?.id
      });
      
      responses.success(res, result, 'Usuario actualizado exitosamente');
    } catch (error) {
      logger.error('Error actualizando usuario:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode, error.details);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Eliminar usuario
   */
  deleteUser = async (req, res) => {
    try {
      const userId = UsuarioValidator.validateUserId(req.params.id);
      const result = await this.usuarioService.deleteUser(userId);
      
      logger.audit('Usuario eliminado', userId, {
        deletedBy: req.user?.id
      });
      
      responses.success(res, result, 'Usuario eliminado exitosamente');
    } catch (error) {
      logger.error('Error eliminando usuario:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Obtener estadísticas de usuarios
   */
  getUserStats = async (req, res) => {
    try {
      const stats = await this.usuarioService.getUserStats();
      
      logger.info('Estadísticas de usuarios obtenidas', { 
        requestedBy: req.user?.id 
      });
      
      responses.success(res, stats, 'Estadísticas obtenidas exitosamente');
    } catch (error) {
      logger.error('Error obteniendo estadísticas:', error);
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };
}

// Crear instancia del controlador
const usuarioController = new UsuarioController();

// Exportar métodos individuales para compatibilidad con rutas existentes
export const getUsuarios = usuarioController.getUsuarios;
export const registerUsuario = usuarioController.registerUsuario;
export const loginUsuario = usuarioController.loginUsuario;
export const loginUsuarioGet = usuarioController.loginUsuarioGet;
export const getUserById = usuarioController.getUserById;
export const updateUser = usuarioController.updateUser;
export const deleteUser = usuarioController.deleteUser;
export const getUserStats = usuarioController.getUserStats;
