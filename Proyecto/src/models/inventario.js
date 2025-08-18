

/*const oracledb = require('oracledb');  
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Inventario {

  static toNumber(value, nombreCampo) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`El campo ${nombreCampo} debe ser un número`);
    return num;
  }

  // CREATE
  static async create(data) {
    let connection;
    try {
      const idNum = await getNextSeqValue('seq_inventario');
      data.id = idNum;

      connection = await getConnection();

      await connection.execute(
        `BEGIN sp_create_inventario(:p_nombre, :p_tipo, :p_cantidad, :p_fechaingreso, :p_fechacaducidad, :p_proveedor, :p_fuente, :p_id); END;`,
        {
          p_nombre: data.nombre,
          p_tipo: data.tipo,
          p_cantidad: this.toNumber(data.cantidad, "cantidad"),
          p_fechaingreso: new Date(data.fechaingreso),
          p_fechacaducidad: data.fechacaducidad ? new Date(data.fechacaducidad) : null,
          p_proveedor: data.proveedor,
          p_fuente: data.fuente,
          p_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      return { ...data, id: data.id };

    } catch (err) {
      console.error("Error en Inventario.create():", err);
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
        `BEGIN sp_get_all_inventario(:p_cursor); END;`,
        { p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Inventario.findAll():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ Compras
  static async findAllCompra() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN sp_get_inventario_compra(:p_cursor); END;`,
        { p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Inventario.findAllCompra():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ Donaciones
  static async findAllDonacion() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN sp_get_inventario_donacion(:p_cursor); END;`,
        { p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Inventario.findAllDonacion():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ Caducados
  static async findAllCaducidad() {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN sp_get_inventario_caducado(:p_cursor); END;`,
        { p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Inventario.findAllCaducidad():", err);
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
        `BEGIN sp_get_inventario_by_id(:p_id, :p_cursor); END;`,
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
      console.error("Error en Inventario.findById():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // SEARCH by nombre
  static async searchByNombre(nombre) {
    let connection;
    let cursor;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `BEGIN sp_search_inventario_by_nombre(:p_nombre, :p_cursor); END;`,
        {
          p_nombre: nombre,
          p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Inventario.searchByNombre():", err);
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

    // Validar que fechaIngreso exista
    if (!data.fechaingreso) {
      throw new Error("La fecha de ingreso es obligatoria");
    }

    connection = await getConnection();
    await connection.execute(
      `BEGIN sp_update_inventario(
        :p_id, 
        :p_nombre, 
        :p_tipo, 
        :p_cantidad, 
        :p_fechaingreso, 
        :p_fechacaducidad, 
        :p_proveedor, 
        :p_fuente
      ); END;`,
      {
        p_id: idNum,
        p_nombre: data.nombre,
        p_tipo: data.tipo,
        p_cantidad: this.toNumber(data.cantidad, "cantidad"),
        // Enviar fechas como strings 'YYYY-MM-DD' o usar TO_DATE en el SP
        p_fechaingreso: data.fechaIngreso,
        p_fechacaducidad: data.fechaCaducidad || null,
        p_proveedor: data.proveedor,
        p_fuente: data.fuente
      }
    );

    return { ...data, id: idNum };
  } catch (err) {
    console.error("Error en Inventario.update():", err);
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
        `BEGIN sp_delete_inventario(:p_id); END;`,
        { p_id: idNum }
      );
      return true;
    } catch (err) {
      console.error("Error en Inventario.delete():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

   static async estaVencido(itemId) {
    let connection;
    try {
      const idNum = this.toNumber(itemId, "itemId");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_inventario_vencido(:id) AS vencido FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].VENCIDO;
    } catch (err) {
      console.error(`Error en Inventario.estaVencido(${itemId}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }
}

module.exports = Inventario;*/
const oracledb = require('oracledb');  
const { getConnection, closeConnection, getNextSeqValue } = require('../config/db');

class Inventario {

  static toNumber(value, nombreCampo) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`El campo ${nombreCampo} debe ser un número`);
    return num;
  }

  // CREATE
  static async create(data) {
    let connection;
    try {
      const idNum = await getNextSeqValue('seq_inventario');
      data.id = idNum;

      connection = await getConnection();

      await connection.execute(
        `BEGIN pkg_inventario.sp_create_inventario(
          :p_nombre, :p_tipo, :p_cantidad, :p_fechacaducidad, :p_id
        ); END;`,
        {
          p_nombre: data.nombre,
          p_tipo: data.tipo,
          p_cantidad: this.toNumber(data.cantidad, "cantidad"),
          p_fechacaducidad: data.fechacaducidad ? new Date(data.fechacaducidad) : null,
          p_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }
      );

      return { ...data, id: data.id };

    } catch (err) {
      console.error("Error en Inventario.create():", err);
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
        `BEGIN pkg_inventario.sp_get_all_inventario(:p_cursor); END;`,
        { p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows;
    } catch (err) {
      console.error("Error en Inventario.findAll():", err);
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
        `BEGIN pkg_inventario.sp_get_inventario_by_tipo(:p_tipo, :p_cursor); END;`,
        {
          p_tipo: idNum,  // Ajustar si quieres buscar por ID en un SP separado
          p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }
      );
      cursor = result.outBinds.p_cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      return rows[0] || null;
    } catch (err) {
      console.error("Error en Inventario.findById():", err);
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
      connection = await getConnection();

      await connection.execute(
        `BEGIN pkg_inventario.sp_update_inventario(
          :p_id, :p_nombre, :p_tipo, :p_cantidad, :p_fechacaducidad
        ); END;`,
        {
          p_id: idNum,
          p_nombre: data.nombre,
          p_tipo: data.tipo,
          p_cantidad: this.toNumber(data.cantidad, "cantidad"),
          p_fechacaducidad: data.fechacaducidad ? new Date(data.fechacaducidad) : null
        }
      );

      return { ...data, id: idNum };
    } catch (err) {
      console.error("Error en Inventario.update():", err);
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
        `BEGIN pkg_inventario.sp_delete_inventario(:p_id); END;`,
        { p_id: idNum }
      );
      return true;
    } catch (err) {
      console.error("Error en Inventario.delete():", err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // CHECK VENCIDO
  static async estaVencido(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT pkg_inventario.fn_inventario_vencido(:p_id) AS vencido FROM dual`,
        { p_id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].VENCIDO;
    } catch (err) {
      console.error(`Error en Inventario.estaVencido(${id}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

}

module.exports = Inventario;



