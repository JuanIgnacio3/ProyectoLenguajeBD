


/*const oracledb = require('oracledb');  
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Evento {

  static toNumber(value, fieldName) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`${fieldName} debe ser un número`);
    return num;
  }

  // CREATE
  static async create(data) {
    let connection;
    try {
      const seqId = await getNextSeqValue('seq_eventos');
      data.id = seqId;

      const responsableNum = data.responsable != null ? this.toNumber(data.responsable, "responsable") : null;
      const fechaOracle = data.fecha ? new Date(data.fecha) : null;

      connection = await getConnection();
      await connection.execute(
        `BEGIN sp_create_evento(:p_nombre, :p_descripcion, :p_fecha, :p_ubicacion, :p_responsable, :p_tipo, :p_estado, :p_id); END;`,
        {
          p_nombre: data.nombre,
          p_descripcion: data.descripcion,
          p_fecha: fechaOracle,
          p_ubicacion: data.ubicacion,
          p_responsable: responsableNum,
          p_tipo: data.tipo,
          p_estado: data.estado,
          p_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      return { ...data };

    } catch (err) {
      console.error("Error en Evento.create():", err);
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
        `BEGIN sp_get_all_eventos(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Evento.findAll():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ Virtuales
  static async findAllVirtuales() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN sp_get_eventos_virtuales(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Evento.findAllVirtuales():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ Presenciales
  static async findAllPresenciales() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN sp_get_eventos_presenciales(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Evento.findAllPresenciales():", err);
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
        `BEGIN sp_get_evento_by_id(:p_id, :p_cursor); END;`,
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
      console.error("Error en Evento.findById():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // UPDATE
 static async update(id, { nombre, descripcion, fecha, ubicacion, responsable, tipo, estado }) {
  // Validaciones de tipo y estado
  const tiposValidos = ['Presencial', 'Virtual'];
  const estadosValidos = ['En curso', 'Planificado', 'Finalizado'];

  if (!tiposValidos.includes(tipo)) {
    throw new Error(`Valor inválido para tipo: ${tipo}. Debe ser 'Presencial' o 'Virtual'.`);
  }

  if (!estadosValidos.includes(estado)) {
    throw new Error(`Valor inválido para estado: ${estado}. Debe ser 'En curso', 'Planificado' o 'Finalizado'.`);
  }

  // Convertir fecha a formato YYYY-MM-DD
  const fechaOracle = new Date(fecha).toISOString().split('T')[0];

  let connection;

  try {
    connection = await getConnection();

    // Llamada al procedimiento almacenado usando TO_DATE para evitar ORA-01861
    const result = await connection.execute(
      `BEGIN
         SP_UPDATE_EVENTO(
           :p_id,
           :p_nombre,
           :p_descripcion,
           TO_DATE(:p_fecha,'YYYY-MM-DD'),
           :p_ubicacion,
           :p_responsable,
           :p_tipo,
           :p_estado
         );
       END;`,
      {
        p_id: id,
        p_nombre: nombre,
        p_descripcion: descripcion,
        p_fecha: fechaOracle,
        p_ubicacion: ubicacion,
        p_responsable: responsable,
        p_tipo: tipo,
        p_estado: estado
      }
    );

    return result;

  } catch (err) {
    console.error('Error en Evento.updateEvento():', err);
    throw err;

  } finally {
    await closeConnection(connection);
  }
}



  // DELETE
  static async delete(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      await connection.execute(
        `BEGIN sp_delete_evento(:p_id); END;`,
        { p_id: idNum }
      );
      return true;
    } catch (err) {
      console.error("Error en Evento.delete():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async getEstadoTexto(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_evento_estado_texto(:id) AS estado FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].ESTADO;
    } catch (err) {
      console.error(`Error en Evento.getEstadoTexto(${id}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async getAsistentes(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_evento_asistentes(:id) AS asistentes FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].ASISTENTES;
    } catch (err) {
      console.error(`Error en Evento.getAsistentes(${id}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }
}

module.exports = Evento;*/

const oracledb = require('oracledb');  
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Evento {

  static toNumber(value, fieldName) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`${fieldName} debe ser un número`);
    return num;
  }

  // CREATE
  static async create(data) {
    let connection;
    try {
      const seqId = await getNextSeqValue('seq_eventos');
      data.id = seqId;

      const responsableNum = data.responsable != null ? this.toNumber(data.responsable, "responsable") : null;
      const fechaOracle = data.fecha ? new Date(data.fecha) : null;

      connection = await getConnection();
      await connection.execute(
        `BEGIN pkg_evento.sp_create_evento(
           :p_nombre, :p_descripcion, :p_fecha, :p_ubicacion, :p_responsable, :p_tipo, :p_estado, :p_id
         ); END;`,
        {
          p_nombre: data.nombre,
          p_descripcion: data.descripcion,
          p_fecha: fechaOracle,
          p_ubicacion: data.ubicacion,
          p_responsable: responsableNum,
          p_tipo: data.tipo,
          p_estado: data.estado,
          p_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      return { ...data };

    } catch (err) {
      console.error("Error en Evento.create():", err);
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
        `BEGIN pkg_evento.sp_get_all_eventos(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Evento.findAll():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ Virtuales
  static async findAllVirtuales() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN pkg_evento.sp_get_eventos_virtuales(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Evento.findAllVirtuales():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ Presenciales
  static async findAllPresenciales() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN pkg_evento.sp_get_eventos_presenciales(:cursor); END;`,
        { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Evento.findAllPresenciales():", err);
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
        `BEGIN pkg_evento.sp_get_evento_by_id(:p_id, :p_cursor); END;`,
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
      console.error("Error en Evento.findById():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // UPDATE
  static async update(id, { nombre, descripcion, fecha, ubicacion, responsable, tipo, estado }) {
    const tiposValidos = ['Presencial', 'Virtual'];
    const estadosValidos = ['En curso', 'Planificado', 'Finalizado'];

    if (!tiposValidos.includes(tipo)) throw new Error(`Tipo inválido: ${tipo}`);
    if (!estadosValidos.includes(estado)) throw new Error(`Estado inválido: ${estado}`);

    const fechaOracle = fecha ? new Date(fecha).toISOString().split('T')[0] : null;

    let connection;
    try {
      connection = await getConnection();
      await connection.execute(
        `BEGIN pkg_evento.sp_update_evento(
           :p_id, :p_nombre, :p_descripcion, TO_DATE(:p_fecha,'YYYY-MM-DD'),
           :p_ubicacion, :p_responsable, :p_tipo, :p_estado
         ); END;`,
        {
          p_id: id,
          p_nombre: nombre,
          p_descripcion: descripcion,
          p_fecha: fechaOracle,
          p_ubicacion: ubicacion,
          p_responsable: responsable,
          p_tipo: tipo,
          p_estado: estado
        }
      );
      return true;
    } catch (err) {
      console.error("Error en Evento.update():", err);
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
        `BEGIN pkg_evento.sp_delete_evento(:p_id); END;`,
        { p_id: idNum }
      );
      return true;
    } catch (err) {
      console.error("Error en Evento.delete():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // GET ESTADO TEXTO
  static async getEstadoTexto(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT pkg_evento.fn_evento_estado_texto(:p_id) AS estado FROM dual`,
        { p_id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].ESTADO;
    } catch (err) {
      console.error(`Error en Evento.getEstadoTexto(${id}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // GET ASISTENTES
  static async getAsistentes(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT pkg_evento.fn_evento_asistentes(:p_id) AS asistentes FROM dual`,
        { p_id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].ASISTENTES;
    } catch (err) {
      console.error(`Error en Evento.getAsistentes(${id}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }
}

module.exports = Evento;
