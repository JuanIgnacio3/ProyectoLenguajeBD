const oracledb = require('oracledb');
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Inventario {
  // CREATE
  static async create(data) {
    let connection;
    try {
      const seqId = await getNextSeqValue('seq_inventario');
      data.id = seqId;

      connection = await getConnection();
      await connection.execute(
        `INSERT INTO Inventario (id, nombre, tipo, cantidad, fechaingreso, fechacaducidad, proveedor, fuente) 
         VALUES (:id, :nombre, :tipo, :cantidad, :fechaingreso, :fechacaducidad, :proveedor, :fuente)`,
        {
          id: data.id,
          nombre: data.nombre,
          tipo: data.tipo,
          cantidad: data.cantidad,
          fechaingreso: data.fechaingreso,
          fechacaducidad: data.fechacaducidad,
          proveedor: data.proveedor,
          fuente: data.fuente
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
        `SELECT * FROM Inventario`,
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
        `SELECT * FROM Inventario WHERE id = :id`,
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
        `SELECT * FROM Inventario WHERE LOWER(nombre) LIKE '%' || LOWER(:nombre) || '%'`,
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
        `UPDATE Inventarios 
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
        `DELETE FROM Inventarios WHERE id = :id`,
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

module.exports = Inventario;
