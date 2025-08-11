const oracledb = require('oracledb');
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Mascota {
  // CREATE
  static async create(data) {
    let connection;
    try {
      const seqId = await getNextSeqValue('seq_mascotas');
      data.id = seqId;

      connection = await getConnection();
      await connection.execute(
        `INSERT INTO Mascotas (id, nombre, raza, edad, descripcion, foto, estado, usuario)
         VALUES (:id, :nombre, :raza, :edad, :descripcion, :foto, :estado, :usuario)`,
        {
          id: data.id,
          nombre: data.nombre,
          raza: data.raza,
          edad: data.edad,
          descripcion: data.descripcion,
          foto: data.foto,
          estado: data.estado,
          usuario: data.usuario
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
        `SELECT m.id, m.nombre, m.raza, m.edad, m.estado, u.nombre AS dueno
         FROM Mascotas m
         JOIN Usuarios u ON m.usuario = u.id
         ORDER BY m.nombre`,
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

  // READ (by ID)
  static async findById(id) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT * FROM Mascotas WHERE id = :id`,
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

  // SEARCH (by name or breed)
  static async searchByNameOrBreed(text) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT m.*, u.nombre AS dueno
         FROM Mascotas m
         JOIN Usuarios u ON m.usuario = u.id
         WHERE LOWER(m.nombre) LIKE '%' || LOWER(:text) || '%' 
            OR LOWER(m.raza) LIKE '%' || LOWER(:text) || '%'`,
        { text },
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
        `UPDATE Mascotas
         SET nombre = :nombre,
             raza = :raza,
             edad = :edad,
             descripcion = :descripcion,
             foto = :foto,
             estado = :estado,
             usuario = :usuario
         WHERE id = :id`,
        {
          id,
          nombre: data.nombre,
          raza: data.raza,
          edad: data.edad,
          descripcion: data.descripcion,
          foto: data.foto,
          estado: data.estado,
          usuario: data.usuario
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
      // Primero eliminamos historial médico
      await connection.execute(
        `DELETE FROM HistorialMedico WHERE mascota = :id`,
        [id],
        { autoCommit: false }
      );

      const result = await connection.execute(
        `DELETE FROM Mascotas WHERE id = :id`,
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

module.exports = Mascota;
