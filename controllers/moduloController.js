import { ModuloService } from "../services/ModuloService.js";
import { ModuloValidator } from "../validators/ModuloValidator.js";
import { logger } from "../utils/logger.js";
import { responses } from "../utils/index.js";
import { AppError } from "../utils/errors.js";

/**
 * Controlador para manejo de módulos
 * Utiliza la capa de servicios para la lógica de negocio
 */
export class ModuloController {
  constructor() {
    this.moduloService = new ModuloService();
  }

  /**
   * Obtener todos los módulos
   */
  getModulos = async (req, res) => {
    try {
      const options = {
        orderBy: req.query.orderBy || 'orden ASC',
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset) : undefined
      };

      const modulos = await this.moduloService.getAllModulos(options);
      
      logger.info('Módulos obtenidos exitosamente', { 
        count: modulos.length,
        userId: req.user?.id 
      });
      
      responses.success(res, modulos, 'Módulos obtenidos exitosamente');
    } catch (error) {
      logger.error('Error obteniendo módulos:', error);
      responses.error(res, 'Error obteniendo módulos', 500, error);
    }
  };

  /**
   * Obtener módulo por ID
   */
  getModuloById = async (req, res) => {
    try {
      const moduloId = ModuloValidator.validateModuloId(req.params.id);
      const modulo = await this.moduloService.getModuloById(moduloId);
      
      logger.info('Módulo obtenido por ID', { 
        moduloId,
        requestedBy: req.user?.id 
      });
      
      responses.success(res, modulo, 'Módulo obtenido exitosamente');
    } catch (error) {
      logger.error('Error obteniendo módulo por ID:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Crear nuevo módulo
   */
  createModulo = async (req, res) => {
    try {
      // Validar datos de entrada
      const validatedData = ModuloValidator.validateCreate(req.body);
      
      // Crear módulo usando el servicio
      const result = await this.moduloService.createModulo(validatedData);
      
      logger.audit('Módulo creado', result.id, {
        nombre: result.nombre,
        orden: result.orden,
        createdBy: req.user?.id
      });
      
      responses.success(res, result, 'Módulo creado exitosamente', 201);
    } catch (error) {
      logger.error('Error creando módulo:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode, error.details);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Actualizar módulo
   */
  updateModulo = async (req, res) => {
    try {
      const moduloId = ModuloValidator.validateModuloId(req.params.id);
      const validatedData = ModuloValidator.validateUpdate(req.body);
      
      const result = await this.moduloService.updateModulo(moduloId, validatedData);
      
      logger.audit('Módulo actualizado', moduloId, {
        updatedFields: Object.keys(validatedData),
        updatedBy: req.user?.id
      });
      
      responses.success(res, result, 'Módulo actualizado exitosamente');
    } catch (error) {
      logger.error('Error actualizando módulo:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode, error.details);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Eliminar módulo
   */
  deleteModulo = async (req, res) => {
    try {
      const moduloId = ModuloValidator.validateModuloId(req.params.id);
      const result = await this.moduloService.deleteModulo(moduloId);
      
      logger.audit('Módulo eliminado', moduloId, {
        deletedBy: req.user?.id
      });
      
      responses.success(res, result, 'Módulo eliminado exitosamente');
    } catch (error) {
      logger.error('Error eliminando módulo:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Buscar módulos por nombre
   */
  searchModulos = async (req, res) => {
    try {
      const searchTerm = ModuloValidator.validateSearchTerm(req.query.q || '');
      const modulos = await this.moduloService.searchModulos(searchTerm);
      
      logger.info('Búsqueda de módulos realizada', { 
        searchTerm,
        resultsCount: modulos.length,
        userId: req.user?.id 
      });
      
      responses.success(res, modulos, 'Búsqueda completada exitosamente');
    } catch (error) {
      logger.error('Error en búsqueda de módulos:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Reordenar módulos
   */
  reorderModulos = async (req, res) => {
    try {
      const moduloIds = ModuloValidator.validateReorderIds(req.body);
      const result = await this.moduloService.reorderModulos(moduloIds);
      
      logger.audit('Módulos reordenados', null, {
        reorderedCount: result.reordered,
        reorderedBy: req.user?.id
      });
      
      responses.success(res, result, 'Módulos reordenados exitosamente');
    } catch (error) {
      logger.error('Error reordenando módulos:', error);
      
      if (error instanceof AppError) {
        return responses.error(res, error.message, error.statusCode, error.details);
      }
      
      responses.error(res, 'Error interno del servidor', 500, error);
    }
  };

  /**
   * Obtener estadísticas de módulos
   */
  getModuloStats = async (req, res) => {
    try {
      const stats = await this.moduloService.getModuloStats();
      
      logger.info('Estadísticas de módulos obtenidas', { 
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
const moduloController = new ModuloController();

// Exportar métodos individuales para compatibilidad con rutas existentes
export const getModulos = moduloController.getModulos;
export const getModuloById = moduloController.getModuloById;
export const createModulo = moduloController.createModulo;
export const updateModulo = moduloController.updateModulo;
export const deleteModulo = moduloController.deleteModulo;
export const searchModulos = moduloController.searchModulos;
export const reorderModulos = moduloController.reorderModulos;
export const getModuloStats = moduloController.getModuloStats;
