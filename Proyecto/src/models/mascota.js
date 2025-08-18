const oracledb = require('oracledb');  
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Mascota {

  static toNumber(value, nombreCampo) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`El campo ${nombreCampo} debe ser un número`);
    return num;
  }

  // CREATE
  static async create(data) {
    let connection;
    try {
      const seqId = await getNextSeqValue('seq_mascotas');
      data.id = seqId;

      const edadNum = data.edad != null ? this.toNumber(data.edad, "edad") : null;
      const usuarioNum = data.usuario != null ? this.toNumber(data.usuario, "usuario") : null;

      connection = await getConnection();

      await connection.execute(
        `BEGIN pkg_mascota.sp_create_mascota(:p_nombre, :p_raza, :p_edad, :p_descripcion, :p_foto, :p_estado, :p_usuario, :p_id); END;`,
        {
          p_nombre: data.nombre,
          p_raza: data.raza,
          p_edad: edadNum,
          p_descripcion: data.descripcion,
          p_foto: data.foto,
          p_estado: data.estado,
          p_usuario: usuarioNum,
          p_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      return { ...data };

    } catch (err) {
      console.error("Error en Mascota.create():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ ALL
  static async findAll() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN pkg_mascota.sp_get_all_mascotas(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Mascota.findAll():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ BY ID
  static async findById(id) {
    let connection;
    let cursor;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();

      const result = await connection.execute(
        `BEGIN pkg_mascota.sp_get_mascota_by_id(:p_id, :p_cursor); END;`,
        {
          p_id: idNum,
          p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }
      );

      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();

      return rows[0] || null;
    } catch (err) {
      console.error("Error en Mascota.findById():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // SEARCH (by name or breed)
  static async searchByNameOrBreed(text) {
    let connection;
    let cursor;
    try {
      connection = await getConnection();

      const result = await connection.execute(
        `BEGIN pkg_mascota.sp_search_mascota_by_name_or_breed(:p_text, :p_cursor); END;`,
        {
          p_text: text,
          p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }
      );

      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Mascota.searchByNameOrBreed():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // UPDATE
  static async update(id, data) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      const edadNum = data.edad != null ? this.toNumber(data.edad, "edad") : null;
      const usuarioNum = data.usuario != null ? this.toNumber(data.usuario, "usuario") : null;

      connection = await getConnection();

      await connection.execute(
        `BEGIN pkg_mascota.sp_update_mascota(:p_id, :p_nombre, :p_raza, :p_edad, :p_descripcion, :p_foto, :p_estado, :p_usuario); END;`,
        {
          p_id: idNum,
          p_nombre: data.nombre,
          p_raza: data.raza,
          p_edad: edadNum,
          p_descripcion: data.descripcion,
          p_foto: data.foto,
          p_estado: data.estado,
          p_usuario: usuarioNum
        }
      );

      return { ...data, id: idNum };

    } catch (err) {
      console.error("Error en Mascota.update():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // DELETE BY ID
  static async delete(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();

      await connection.execute(
        `BEGIN pkg_mascota.sp_delete_mascota(:p_id); END;`,
        { p_id: idNum }
      );

      return true;

    } catch (err) {
      console.error("Error en Mascota.delete():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // DELETE BY NAME AND BREED
  static async deleteByNameAndBreed(nombre, raza) {
    let connection;
    try {
      connection = await getConnection();

      await connection.execute(
        `BEGIN pkg_mascota.sp_delete_mascota_by_name_and_breed(:p_nombre, :p_raza); END;`,
        { p_nombre: nombre, p_raza: raza }
      );

      return true;

    } catch (err) {
      console.error("Error en Mascota.deleteByNameAndBreed():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ vista Disponibles usando SP
  static async findAllDisponibles() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN pkg_mascota.sp_get_mascotas_disponibles(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error('Error en Mascota.findAllDisponibles():', err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ vista Adoptadas usando SP
  static async findAllAdoptadas() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN pkg_mascota.sp_get_mascotas_adoptadas(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error('Error en Mascota.findAllAdoptadas():', err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // Funciones del paquete
  static async getCategoriaEdad(edad) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT pkg_mascota.fn_categoria_edad(:edad) AS categoria FROM dual`,
        { edad },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].CATEGORIA;
    } catch (err) {
      console.error(`Error en Mascota.getCategoriaEdad(${edad}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async getEstadoTexto(mascotaId) {
    let connection;
    try {
      const idNum = this.toNumber(mascotaId, "mascotaId");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT pkg_mascota.fn_mascota_estado_texto(:id) AS estado FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].ESTADO;
    } catch (err) {
      console.error(`Error en Mascota.getEstadoTexto(${mascotaId}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async tieneHistorial(mascotaId) {
    let connection;
    try {
      const idNum = this.toNumber(mascotaId, "mascotaId");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT pkg_mascota.fn_mascota_tiene_historial(:id) AS tiene FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].TIENE;
    } catch (err) {
      console.error(`Error en Mascota.tieneHistorial(${mascotaId}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async getTotalPorUsuario(usuarioId) {
    let connection;
    try {
      const idNum = this.toNumber(usuarioId, "usuarioId");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT pkg_mascota.fn_total_mascotas_usuario(:id) AS total FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].TOTAL;
    } catch (err) {
      console.error(`Error en Mascota.getTotalPorUsuario(${usuarioId}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

}

module.exports = Mascota;
