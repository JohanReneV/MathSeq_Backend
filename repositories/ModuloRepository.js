import { BaseRepository } from "./BaseRepository.js";

/**
 * Repository para manejo de datos de módulos
 * Extiende BaseRepository con métodos específicos para módulos
 */
export class ModuloRepository extends BaseRepository {
  constructor() {
    super('modulos');
  }

  /**
   * Busca un módulo por ID usando el campo correcto
   * @param {number} moduloId - ID del módulo
   * @returns {Promise<Object|null>} Módulo encontrado o null
   */
  async findById(moduloId) {
    return await super.findById(moduloId, 'id_modulo');
  }

  /**
   * Actualiza un módulo por ID usando el campo correcto
   * @param {number} moduloId - ID del módulo
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateById(moduloId, data) {
    return await super.updateById(moduloId, data, 'id_modulo');
  }

  /**
   * Elimina un módulo por ID usando el campo correcto
   * @param {number} moduloId - ID del módulo
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteById(moduloId) {
    return await super.deleteById(moduloId, 'id_modulo');
  }

  /**
   * Obtiene todos los módulos ordenados por orden
   * @returns {Promise<Array>} Array de módulos ordenados
   */
  async findAllOrdered() {
    return await this.findAll({ orderBy: 'orden ASC' });
  }

  /**
   * Busca módulos por nombre (búsqueda parcial)
   * @param {string} nombre - Nombre o parte del nombre del módulo
   * @returns {Promise<Array>} Array de módulos encontrados
   */
  async searchByName(nombre) {
    const sql = `SELECT * FROM ${this.tableName} WHERE nombre_modulo LIKE ? ORDER BY orden ASC`;
    return await this.query(sql, [`%${nombre}%`]);
  }

  /**
   * Obtiene el siguiente orden disponible
   * @returns {Promise<number>} Siguiente número de orden
   */
  async getNextOrder() {
    const sql = `SELECT MAX(orden) as max_order FROM ${this.tableName}`;
    const results = await this.query(sql);
    return (results[0].max_order || 0) + 1;
  }

  /**
   * Reordena los módulos
   * @param {Array} moduloIds - Array de IDs en el nuevo orden
   * @returns {Promise<Object>} Resultado de la operación
   */
  async reorder(moduloIds) {
    const updates = moduloIds.map((id, index) => 
      this.updateById(id, { orden: index + 1 })
    );
    
    await Promise.all(updates);
    return { success: true, reordered: moduloIds.length };
  }

  /**
   * Obtiene estadísticas de módulos
   * @returns {Promise<Object>} Estadísticas de módulos
   */
  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_modulos,
        MIN(orden) as primer_orden,
        MAX(orden) as ultimo_orden
      FROM ${this.tableName}
    `;
    const results = await this.query(sql);
    return results[0];
  }
}
