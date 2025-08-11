const oracledb = require('oracledb');
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Voluntario {
  // CREATE
  static async create(data) {
    let connection;
    try {
      const seqId = await getNextSeqValue('seq_voluntarios');
      data.id = seqId;

      connection = await getConnection();
      await connection.execute(
        `INSERT INTO Voluntarios (id, usuario, nombre, fechainicio, fechafin, horas, estado) 
         VALUES (:id, :usuario, :nombre, :fechainicio, :fechafin, :horas, :estado)`,
        {
          id: data.id,
          usuario: data.usuario,
          nombre: data.nombre,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          horas: data.horas,
          estado: data.estado
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
        `SELECT * FROM Voluntarios`,
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
        `SELECT * FROM Voluntarios WHERE id = :id`,
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
        `SELECT * FROM Voluntarios WHERE LOWER(nombre) LIKE '%' || LOWER(:nombre) || '%'`,
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
        `UPDATE Voluntarios 
        SET nombre = :nombre, usuario = :usuario, fechainicio = :fechainicio, fechafin = :fechafin, horas = :horas, estado = :estado
         WHERE id = :id`,
        {
          id,
          usuario: data.usuario,
          nombre: data.nombre,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          horas: data.horas,
          estado: data.estado
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
        `DELETE FROM Voluntarios WHERE id = :id`,
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

module.exports = Voluntario;
