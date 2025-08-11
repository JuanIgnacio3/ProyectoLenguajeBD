const oracledb = require('oracledb');
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Reporte {
  // CREATE
  static async create(data) {
    let connection;
    try {
      const seqId = await getNextSeqValue('seq_reportes');
      data.id = seqId;

      connection = await getConnection();
      await connection.execute(
        `INSERT INTO Reportes (id, fecha, usuario, mascota, provincia, canton, distrito, detalles) 
         VALUES (:id, :fecha, :usuario, :mascota, :provincia, :canton, :distrito, :detalles)`,
        {
          id: data.id,
          fecha: data.fecha,
          usuario: data.usuario,
          mascota: data.mascota,
          provincia: data.provincia,
          canton: data.canton,
          distrito: data.distrito,
          detalles: data.detalles
        },
        { autoCommit: true }
      );
      return { ...data };
    } catch (err) {
      throw err;
    } finally {
      await closeConnection(connection);
    }
  }

  // READ (all)
  static async findAll() {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT * FROM Reportes`,
        [],
        { outFormat: oracledb.OBJECT }
      );
      return result.rows;
    } catch (err) {
      throw err;
    } finally {
      await closeConnection(connection);
    }
  }

  // READ (by id)
  static async findById(id) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT * FROM Reportes WHERE id = :id`,
        [id],
        { outFormat: oracledb.OBJECT }
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    } finally {
      await closeConnection(connection);
    }
  }

  // SEARCH (by nombre)
  static async searchByNombre(nombre) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT * FROM Reportes WHERE LOWER(nombre) LIKE '%' || LOWER(:nombre) || '%'`,
        [nombre],
        { outFormat: oracledb.OBJECT }
      );
      return result.rows;
    } catch (err) {
      throw err;
    } finally {
      await closeConnection(connection);
    }
  }

  // UPDATE
  static async update(id, data) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `UPDATE Reportes 
        SET usuario = :usuario, fecha = :fecha, mascota = :mascota, provincia = :provincia, canton = :canton, distrito = :distrito, detalle = :detalles
         WHERE id = :id`,
        {
          id,
          usuario: data.usuario,
          fecha: data.fecha,
          mascota: data.mascota,
          provincia: data.provincia,
          canton: data.canton,
          distrito: data.distrito,
          detalles: data.detalles
        },
        { autoCommit: true }
      );
      return result.rowsAffected > 0 ? { id, ...data } : null;
    } catch (err) {
      throw err;
    } finally {
      await closeConnection(connection);
    }
  }

  // DELETE
  static async delete(id) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `DELETE FROM Reportes WHERE id = :id`,
        [id],
        { autoCommit: true }
      );
      return result.rowsAffected > 0;
    } catch (err) {
      throw err;
    } finally {
      await closeConnection(connection);
    }
  }
}

module.exports = Reporte;
