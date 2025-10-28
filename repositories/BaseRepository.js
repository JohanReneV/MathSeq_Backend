import db from "../config/database.js";
import { logger } from "../utils/index.js";

/**
 * Clase base Repository que implementa operaciones CRUD básicas
 * Patrón Repository para abstraer el acceso a datos
 */
export class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  /**
   * Ejecuta una consulta SQL con manejo de errores
   * @param {string} sql - Consulta SQL
   * @param {Array} params - Parámetros para la consulta
   * @returns {Promise} Resultado de la consulta
   */
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, (err, results) => {
        if (err) {
          logger.error(`Error en consulta SQL (${this.tableName}):`, err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * Busca todos los registros de la tabla
   * @param {Object} options - Opciones de consulta (where, orderBy, limit, offset)
   * @returns {Promise<Array>} Array de registros
   */
  async findAll(options = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];

    // Agregar condiciones WHERE
    if (options.where && Object.keys(options.where).length > 0) {
      const whereClause = Object.keys(options.where)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(options.where));
    }

    // Agregar ORDER BY
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    }

    // Agregar LIMIT y OFFSET
    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`;
      }
    }

    return await this.query(sql, params);
  }

  /**
   * Busca un registro por ID
   * @param {number|string} id - ID del registro
   * @param {string} idField - Nombre del campo ID (por defecto 'id')
   * @returns {Promise<Object|null>} Registro encontrado o null
   */
  async findById(id, idField = 'id') {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${idField} = ?`;
    const results = await this.query(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Busca un registro por condiciones específicas
   * @param {Object} conditions - Condiciones de búsqueda
   * @returns {Promise<Object|null>} Registro encontrado o null
   */
  async findOne(conditions) {
    const results = await this.findAll({ where: conditions, limit: 1 });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Crea un nuevo registro
   * @param {Object} data - Datos del registro
   * @returns {Promise<Object>} Resultado de la inserción
   */
  async create(data) {
    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(data);

    const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    
    return {
      id: result.insertId,
      affectedRows: result.affectedRows
    };
  }

  /**
   * Actualiza un registro por ID
   * @param {number|string} id - ID del registro
   * @param {Object} data - Datos a actualizar
   * @param {string} idField - Nombre del campo ID
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateById(id, data, idField = 'id') {
    const fields = Object.keys(data);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${idField} = ?`;
    const result = await this.query(sql, values);
    
    return {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows
    };
  }

  /**
   * Elimina un registro por ID
   * @param {number|string} id - ID del registro
   * @param {string} idField - Nombre del campo ID
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteById(id, idField = 'id') {
    const sql = `DELETE FROM ${this.tableName} WHERE ${idField} = ?`;
    const result = await this.query(sql, [id]);
    
    return {
      affectedRows: result.affectedRows
    };
  }

  /**
   * Cuenta registros con condiciones opcionales
   * @param {Object} conditions - Condiciones de conteo
   * @returns {Promise<number>} Número de registros
   */
  async count(conditions = {}) {
    let sql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }

    const results = await this.query(sql, params);
    return results[0].total;
  }

  /**
   * Verifica si existe un registro con las condiciones dadas
   * @param {Object} conditions - Condiciones de verificación
   * @returns {Promise<boolean>} True si existe, false si no
   */
  async exists(conditions) {
    const count = await this.count(conditions);
    return count > 0;
  }
}
