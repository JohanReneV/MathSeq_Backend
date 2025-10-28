import { BaseRepository } from "./BaseRepository.js";

/**
 * Repository para manejo de datos de usuarios
 * Extiende BaseRepository con métodos específicos para usuarios
 */
export class UsuarioRepository extends BaseRepository {
  constructor() {
    super('usuarios');
  }

  /**
   * Busca un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async findByEmail(email) {
    return await this.findOne({ correo: email });
  }

  /**
   * Busca usuarios por rol
   * @param {number} rolId - ID del rol
   * @returns {Promise<Array>} Array de usuarios con el rol especificado
   */
  async findByRole(rolId) {
    return await this.findAll({ where: { id_rol: rolId } });
  }

  /**
   * Actualiza la contraseña de un usuario
   * @param {number} userId - ID del usuario
   * @param {string} hashedPassword - Contraseña hasheada
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updatePassword(userId, hashedPassword) {
    return await this.updateById(userId, { contrasena: hashedPassword }, 'id_usuario');
  }

  /**
   * Busca un usuario por ID usando el campo correcto
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async findById(userId) {
    return await super.findById(userId, 'id_usuario');
  }

  /**
   * Actualiza un usuario por ID usando el campo correcto
   * @param {number} userId - ID del usuario
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateById(userId, data) {
    return await super.updateById(userId, data, 'id_usuario');
  }

  /**
   * Elimina un usuario por ID usando el campo correcto
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteById(userId) {
    return await super.deleteById(userId, 'id_usuario');
  }

  /**
   * Obtiene estadísticas de usuarios
   * @returns {Promise<Object>} Estadísticas de usuarios
   */
  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_usuarios,
        COUNT(CASE WHEN id_rol = 1 THEN 1 END) as administradores,
        COUNT(CASE WHEN id_rol = 2 THEN 1 END) as profesores,
        COUNT(CASE WHEN id_rol = 3 THEN 1 END) as estudiantes
      FROM ${this.tableName}
    `;
    const results = await this.query(sql);
    return results[0];
  }
}
