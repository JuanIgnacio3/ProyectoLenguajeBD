

const oracledb = require('oracledb');
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Campania {

  static toNumber(value, nombreCampo) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`El campo ${nombreCampo} debe ser un número`);
    return num;
  }

  // CREATE
  static async create(data) {
    let connection;
    try {
      const idNum = await getNextSeqValue('seq_campanias');
      data.id = idNum;

      const objetivoNum = this.toNumber(data.objetivo, "objetivo");
      const usuarioNum = this.toNumber(data.usuario, "usuario");

      connection = await getConnection();
      await connection.execute(
        `BEGIN sp_create_campania(
          :p_nombre, :p_descripcion, :p_FECHAINICIO, :p_FECHAFIN, 
          :p_objetivo, :p_estado, :p_usuario, :p_id
        ); END;`,
        {
          p_nombre: data.nombre,
          p_descripcion: data.descripcion,
          p_FECHAINICIO: new Date(data.fecha_inicio),
          p_FECHAFIN: new Date(data.fecha_fin),
          p_objetivo: objetivoNum,
          p_estado: data.estado,
          p_usuario: usuarioNum,
          p_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );
      data.id = data.id; // El id ya viene de la secuencia
      return { ...data };

    } catch (err) {
      console.error("Error en Campania.create():", err);
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
        `BEGIN sp_get_all_campanias(:p_cursor); END;`,
        { p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Campania.findAll():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ Activas
  static async findAllActivas() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN sp_get_campanias_activas(:p_cursor); END;`,
        { p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Campania.findAllActivas():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ Inactivas
  static async findAllInactivas() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN sp_get_campanias_inactivas(:p_cursor); END;`,
        { p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Campania.findAllInactivas():", err);
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
        `BEGIN sp_get_campania_by_id(:p_id, :p_cursor); END;`,
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
      console.error("Error en Campania.findById():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

    // READ BY ID
  static async getTotalRecaudado(id) {
  let connection;
  try {
    const idNum = this.toNumber(id, "id"); // asegúrate de que sea número
    connection = await getConnection();    // usa tu conexión existente

    const result = await connection.execute(
      `SELECT fn_campania_recaudado(:id) AS total FROM dual`,
      { id: idNum }, // pasamos el id que recibe la función
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows[0].TOTAL; // devuelve solo el número
  } catch (err) {
    console.error(`Error en Campania.getTotalRecaudado(${id}):`, err);
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
      const objetivoNum = this.toNumber(data.objetivo, "objetivo");
      const usuarioNum = this.toNumber(data.usuario, "usuario");

      connection = await getConnection();
      await connection.execute(
        `BEGIN sp_update_campania(
          :p_id, :p_nombre, :p_descripcion, :p_FECHAINICIO, :p_FECHAFIN, 
          :p_objetivo, :p_estado, :p_usuario
        ); END;`,
        {
          p_id: idNum,
          p_nombre: data.nombre,
          p_descripcion: data.descripcion,
          p_FECHAINICIO: new Date(data.fecha_inicio),
          p_FECHAFIN: new Date(data.fecha_fin),
          p_objetivo: objetivoNum,
          p_estado: data.estado,
          p_usuario: usuarioNum
        }
      );

      return { ...data, id: idNum };

    } catch (err) {
      console.error("Error en Campania.update():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // DELETE
  static async delete(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();

      await connection.execute(
        `BEGIN sp_delete_campania(:p_id); END;`,
        { p_id: idNum }
      );

      return true;

    } catch (err) {
      console.error("Error en Campania.delete():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }


  static async getPorcentajeAvance(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_campania_porcentaje(:id) AS porcentaje FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].PORCENTAJE;
    } catch (err) {
      console.error(`Error en Campania.getPorcentajeAvance(${id}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async getDiasRestantes(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_dias_restantes_campania(:id) AS dias FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].DIAS;
    } catch (err) {
      console.error(`Error en Campania.getDiasRestantes(${id}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }
}

module.exports = Campania;
