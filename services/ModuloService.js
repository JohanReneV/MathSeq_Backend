import { ModuloRepository } from "../repositories/ModuloRepository.js";
import { logger } from "../utils/index.js";
import { AppError } from "../utils/errors.js";

/**
 * Service para manejo de lógica de negocio de módulos
 * Contiene toda la lógica de negocio separada de los controladores
 */
export class ModuloService {
  constructor() {
    this.moduloRepository = new ModuloRepository();
  }

  /**
   * Obtiene todos los módulos ordenados
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Array>} Lista de módulos
   */
  async getAllModulos(options = {}) {
    if (options.orderBy) {
      return await this.moduloRepository.findAll(options);
    }
    return await this.moduloRepository.findAllOrdered();
  }

  /**
   * Obtiene un módulo por ID
   * @param {number} moduloId - ID del módulo
   * @returns {Promise<Object>} Módulo encontrado
   */
  async getModuloById(moduloId) {
    const modulo = await this.moduloRepository.findById(moduloId);
    if (!modulo) {
      throw new AppError('Módulo no encontrado', 404);
    }

    return {
      id: modulo.id_modulo,
      nombre: modulo.nombre_modulo,
      descripcion: modulo.descripcion,
      orden: modulo.orden
    };
  }

  /**
   * Crea un nuevo módulo
   * @param {Object} moduloData - Datos del módulo
   * @returns {Promise<Object>} Módulo creado
   */
  async createModulo(moduloData) {
    const { nombre, descripcion, orden } = moduloData;

    // Si no se especifica orden, obtener el siguiente disponible
    const finalOrder = orden || await this.moduloRepository.getNextOrder();

    // Verificar que el nombre no esté duplicado
    const existingModulo = await this.moduloRepository.findOne({ nombre_modulo: nombre });
    if (existingModulo) {
      throw new AppError('Ya existe un módulo con este nombre', 400);
    }

    const moduloDataToSave = {
      nombre_modulo: nombre,
      descripcion: descripcion || '',
      orden: finalOrder
    };

    const result = await this.moduloRepository.create(moduloDataToSave);
    
    logger.info(`Módulo creado exitosamente: ${nombre}`);

    return {
      id: result.id,
      nombre,
      descripcion: descripcion || '',
      orden: finalOrder,
      message: 'Módulo creado exitosamente'
    };
  }

  /**
   * Actualiza un módulo
   * @param {number} moduloId - ID del módulo
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Módulo actualizado
   */
  async updateModulo(moduloId, updateData) {
    const modulo = await this.moduloRepository.findById(moduloId);
    if (!modulo) {
      throw new AppError('Módulo no encontrado', 404);
    }

    // Si se está actualizando el nombre, verificar que no esté duplicado
    if (updateData.nombre && updateData.nombre !== modulo.nombre_modulo) {
      const existingModulo = await this.moduloRepository.findOne({ nombre_modulo: updateData.nombre });
      if (existingModulo) {
        throw new AppError('Ya existe un módulo con este nombre', 400);
      }
    }

    // Preparar datos para actualización
    const dataToUpdate = {};
    if (updateData.nombre) dataToUpdate.nombre_modulo = updateData.nombre;
    if (updateData.descripcion !== undefined) dataToUpdate.descripcion = updateData.descripcion;
    if (updateData.orden !== undefined) dataToUpdate.orden = updateData.orden;

    const result = await this.moduloRepository.updateById(moduloId, dataToUpdate);
    
    if (result.affectedRows === 0) {
      throw new AppError('No se pudo actualizar el módulo', 500);
    }

    logger.info(`Módulo actualizado: ${moduloId}`);

    return {
      id: moduloId,
      message: 'Módulo actualizado exitosamente'
    };
  }

  /**
   * Elimina un módulo
   * @param {number} moduloId - ID del módulo
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteModulo(moduloId) {
    const modulo = await this.moduloRepository.findById(moduloId);
    if (!modulo) {
      throw new AppError('Módulo no encontrado', 404);
    }

    const result = await this.moduloRepository.deleteById(moduloId);
    
    if (result.affectedRows === 0) {
      throw new AppError('No se pudo eliminar el módulo', 500);
    }

    logger.info(`Módulo eliminado: ${moduloId}`);

    return {
      message: 'Módulo eliminado exitosamente'
    };
  }

  /**
   * Busca módulos por nombre
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Módulos encontrados
   */
  async searchModulos(searchTerm) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return await this.getAllModulos();
    }

    const modulos = await this.moduloRepository.searchByName(searchTerm);
    
    return modulos.map(modulo => ({
      id: modulo.id_modulo,
      nombre: modulo.nombre_modulo,
      descripcion: modulo.descripcion,
      orden: modulo.orden
    }));
  }

  /**
   * Reordena los módulos
   * @param {Array} moduloIds - Array de IDs en el nuevo orden
   * @returns {Promise<Object>} Resultado de la operación
   */
  async reorderModulos(moduloIds) {
    if (!Array.isArray(moduloIds) || moduloIds.length === 0) {
      throw new AppError('Se requiere un array de IDs válido', 400);
    }

    // Verificar que todos los módulos existan
    for (const id of moduloIds) {
      const modulo = await this.moduloRepository.findById(id);
      if (!modulo) {
        throw new AppError(`Módulo con ID ${id} no encontrado`, 404);
      }
    }

    const result = await this.moduloRepository.reorder(moduloIds);
    
    logger.info(`Módulos reordenados: ${moduloIds.length} módulos`);

    return {
      message: 'Módulos reordenados exitosamente',
      reordered: result.reordered
    };
  }

  /**
   * Obtiene estadísticas de módulos
   * @returns {Promise<Object>} Estadísticas
   */
  async getModuloStats() {
    return await this.moduloRepository.getStats();
  }

  /**
   * Valida los datos de un módulo
   * @param {Object} moduloData - Datos del módulo
   * @param {boolean} isUpdate - Si es una actualización
   * @returns {Object} Datos validados
   */
  validateModuloData(moduloData, isUpdate = false) {
    const errors = [];

    if (!isUpdate || moduloData.nombre !== undefined) {
      if (!moduloData.nombre || moduloData.nombre.trim().length === 0) {
        errors.push('El nombre del módulo es requerido');
      } else if (moduloData.nombre.length > 100) {
        errors.push('El nombre del módulo no puede exceder 100 caracteres');
      }
    }

    if (moduloData.descripcion !== undefined && moduloData.descripcion.length > 500) {
      errors.push('La descripción no puede exceder 500 caracteres');
    }

    if (moduloData.orden !== undefined) {
      if (!Number.isInteger(moduloData.orden) || moduloData.orden < 1) {
        errors.push('El orden debe ser un número entero positivo');
      }
    }

    if (errors.length > 0) {
      throw new AppError('Errores de validación', 400, errors);
    }

    return {
      nombre: moduloData.nombre?.trim(),
      descripcion: moduloData.descripcion?.trim() || '',
      orden: moduloData.orden
    };
  }
}
