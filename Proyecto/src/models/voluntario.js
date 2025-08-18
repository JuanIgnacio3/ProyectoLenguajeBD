/*const oracledb = require('oracledb');
const { getConnection, closeConnection } = require('../config/db');

class Voluntario {

  static toNumber(value, nombreCampo) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`El campo ${nombreCampo} debe ser un número`);
    return num;
  }

  // CREATE
  static async create(data) {
    let connection;
    try {
      // Validaciones
      if (!data.usuario) throw new Error("Usuario es requerido");
      if (!data.fecha_inicio) throw new Error("Fecha de inicio es requerida");
      if (!data.horas) throw new Error("Horas son requeridas");
      if (!data.estado) throw new Error("Estado es requerido");

      const usuarioNum = this.toNumber(data.usuario, "usuario");
      const horasNum = this.toNumber(data.horas, "horas");
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = data.fecha_fin ? new Date(data.fecha_fin) : null;

      // Validación: fecha_fin posterior a fecha_inicio
      if (fechaFin && fechaFin < fechaInicio)
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');

      connection = await getConnection();

      const result = await connection.execute(
        `BEGIN sp_create_voluntario(:p_usuario, :p_fechainicio, :p_fechafin, :p_horas, :p_estado, :p_id); END;`,
        {
          p_usuario: usuarioNum,
          p_fechainicio: fechaInicio,
          p_fechafin: fechaFin,
          p_horas: horasNum,
          p_estado: data.estado,
          p_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      data.id = result.outBinds.p_id;

      return { success: true, data };
    } catch (err) {
      console.error("Error en Voluntario.create():", err);
      return { success: false, message: err.message };
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ (all)
  static async findAll() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();

      const result = await connection.execute(
        `BEGIN sp_get_all_voluntarios(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );

      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows(); // obtiene todos
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Voluntario.findAll():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ (by id)
  static async findById(id) {
    let connection;
    let cursor;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();

      const result = await connection.execute(
        `BEGIN sp_get_voluntario_by_id(:p_id, :p_cursor); END;`,
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
      console.error("Error en Voluntario.findById():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // SEARCH (by usuario)
  static async searchByUsuario(usuario) {
    let connection;
    let cursor;
    try {
      const usuarioNum = this.toNumber(usuario, "usuario");
      connection = await getConnection();

      const result = await connection.execute(
        `BEGIN sp_search_voluntario_by_usuario(:p_usuario, :p_cursor); END;`,
        {
          p_usuario: usuarioNum,
          p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }
      );

      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();

      return rows;
    } catch (err) {
      console.error("Error en Voluntario.searchByUsuario():", err);
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
      const usuarioNum = this.toNumber(data.usuario, "usuario");
      const horasNum = this.toNumber(data.horas, "horas");
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = data.fecha_fin ? new Date(data.fecha_fin) : null;

      connection = await getConnection();

      await connection.execute(
        `BEGIN sp_update_voluntario(:p_id, :p_usuario, :p_fechainicio, :p_fechafin, :p_horas, :p_estado); END;`,
        {
          p_id: idNum,
          p_usuario: usuarioNum,
          p_fechainicio: fechaInicio,
          p_fechafin: fechaFin,
          p_horas: horasNum,
          p_estado: data.estado
        }
      );

      return { ...data, id: idNum };
    } catch (err) {
      console.error("Error en Voluntario.update():", err);
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
        `BEGIN sp_delete_voluntario(:p_id); END;`,
        { p_id: idNum }
      );

      return true;
    } catch (err) {
      console.error("Error en Voluntario.delete():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }


  static async getHoras(voluntarioId) {
    let connection;
    try {
      const idNum = this.toNumber(voluntarioId, "voluntarioId");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_voluntario_horas(:id) AS horas FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].HORAS;
    } catch (err) {
      console.error(`Error en Voluntario.getHoras(${voluntarioId}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async esVoluntario(usuarioId) {
    let connection;
    try {
      const idNum = this.toNumber(usuarioId, "usuarioId");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_es_voluntario(:id) AS es FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].ES;
    } catch (err) {
      console.error(`Error en Voluntario.esVoluntario(${usuarioId}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  
}
}

module.exports = Voluntario;*/

const oracledb = require('oracledb');
const { getConnection, closeConnection } = require('../config/db');

class Voluntario {

  static toNumber(value, nombreCampo) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`El campo ${nombreCampo} debe ser un número`);
    return num;
  }

  // CREATE
  static async create(data) {
    let connection;
    try {
      if (!data.usuario) throw new Error("Usuario es requerido");
      if (!data.fecha_inicio) throw new Error("Fecha de inicio es requerida");
      if (!data.horas) throw new Error("Horas son requeridas");
      if (!data.estado) throw new Error("Estado es requerido");

      const usuarioNum = this.toNumber(data.usuario, "usuario");
      const horasNum = this.toNumber(data.horas, "horas");
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = data.fecha_fin ? new Date(data.fecha_fin) : null;

      if (fechaFin && fechaFin < fechaInicio)
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');

      connection = await getConnection();

      const result = await connection.execute(
        `BEGIN pkg_voluntario.sp_create_voluntario(:p_usuario, :p_fechainicio, :p_fechafin, :p_horas, :p_estado, :p_id); END;`,
        {
          p_usuario: usuarioNum,
          p_fechainicio: fechaInicio,
          p_fechafin: fechaFin,
          p_horas: horasNum,
          p_estado: data.estado,
          p_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      data.id = result.outBinds.p_id;

      return { success: true, data };
    } catch (err) {
      console.error("Error en Voluntario.create():", err);
      return { success: false, message: err.message };
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ (all)
  static async findAll() {
    let connection, cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN pkg_voluntario.sp_get_all_voluntarios(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );

      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows(); 
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Voluntario.findAll():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ (by id)
  static async findById(id) {
    let connection, cursor;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN pkg_voluntario.sp_get_voluntario_by_id(:p_id, :p_cursor); END;`,
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
      console.error("Error en Voluntario.findById():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // SEARCH (by usuario)
  static async searchByUsuario(usuario) {
    let connection, cursor;
    try {
      const usuarioNum = this.toNumber(usuario, "usuario");
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN pkg_voluntario.sp_search_voluntario_by_usuario(:p_usuario, :p_cursor); END;`,
        {
          p_usuario: usuarioNum,
          p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }
      );

      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();

      return rows;
    } catch (err) {
      console.error("Error en Voluntario.searchByUsuario():", err);
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
      const usuarioNum = this.toNumber(data.usuario, "usuario");
      const horasNum = this.toNumber(data.horas, "horas");
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = data.fecha_fin ? new Date(data.fecha_fin) : null;

      connection = await getConnection();
      await connection.execute(
        `BEGIN pkg_voluntario.sp_update_voluntario(:p_id, :p_usuario, :p_fechainicio, :p_fechafin, :p_horas, :p_estado); END;`,
        {
          p_id: idNum,
          p_usuario: usuarioNum,
          p_fechainicio: fechaInicio,
          p_fechafin: fechaFin,
          p_horas: horasNum,
          p_estado: data.estado
        }
      );

      return { ...data, id: idNum };
    } catch (err) {
      console.error("Error en Voluntario.update():", err);
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
        `BEGIN pkg_voluntario.sp_delete_voluntario(:p_id); END;`,
        { p_id: idNum }
      );

      return true;
    } catch (err) {
      console.error("Error en Voluntario.delete():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // FUNCIONES AUXILIARES
  static async getHoras(voluntarioId) {
    let connection;
    try {
      const idNum = this.toNumber(voluntarioId, "voluntarioId");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT pkg_voluntario.fn_voluntario_horas(:id) AS horas FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].HORAS;
    } catch (err) {
      console.error(`Error en Voluntario.getHoras(${voluntarioId}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async esVoluntario(usuarioId) {
    let connection;
    try {
      const idNum = this.toNumber(usuarioId, "usuarioId");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT pkg_voluntario.fn_es_voluntario(:id) AS es FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].ES;
    } catch (err) {
      console.error(`Error en Voluntario.esVoluntario(${usuarioId}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

}

module.exports = Voluntario;


