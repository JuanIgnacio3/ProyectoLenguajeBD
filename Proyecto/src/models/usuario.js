/*const oracledb = require('oracledb');
const bcrypt = require('bcrypt');
const { getConnection, closeConnection } = require('../config/db');

class Usuario {

  static toNumber(value, nombreCampo) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`El campo ${nombreCampo} debe ser un número`);
    return num;
  }
  
  // CREATE
  static async create({ nombre, apellido, email, password, telefono, rol }) {
    let connection;
    try {
      connection = await getConnection();

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await connection.execute(
        `INSERT INTO Usuarios (id, nombre, apellido, email, password, telefono, rol)
         VALUES (seq_usuarios.NEXTVAL, :nombre, :apellido, :email, :password, :telefono, :rol)
         RETURNING id INTO :id`,
        {
          nombre,
          apellido,
          email: email.toLowerCase(),
          password: hashedPassword,
          telefono: telefono || null,
          rol,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        },
        { autoCommit: true }
      );

      return { ID: result.outBinds.id[0], nombre, apellido, email, telefono, rol };

    } catch (err) {
      console.error('Error en Usuario.create:', err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }
  // READ by email
  static async findByEmail(email) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT id, nombre, apellido, email, password, rol, telefono 
                 FROM Usuarios 
                 WHERE LOWER(email) = :email`,
        { email: email.toLowerCase() },
        { outFormat: oracledb.OBJECT }
      );
      if (result.rows.length === 0) return null;

      // Normalizar las claves a mayúscula para consistencia con AuthController
      const row = result.rows[0];
      return {
        ID: row.ID,
        NOMBRE: row.NOMBRE,
        APELLIDO: row.APELLIDO,
        EMAIL: row.EMAIL,
        PASSWORD: row.PASSWORD,
        TELEFONO: row.TELEFONO,
        ROL: row.ROL
      };
    } catch (err) {
      console.error('Error en Usuario.findByEmail:', err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }
  

  // AUTHENTICATE
  static async authenticateUser(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user || !user.PASSWORD) {
        console.error('Usuario no encontrado o sin contraseña');
        return null;
      }

      const isMatch = await bcrypt.compare(password, user.PASSWORD);
      return isMatch ? user : null;
    } catch (err) {
      console.error('Error en Usuario.authenticateUser:', err);
      throw err;
    }
  }


  // READ all users
static async findAll() {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT id, nombre FROM Usuarios ORDER BY nombre`,
            {},
            { outFormat: oracledb.OBJECT }
        );

        return result.rows.map(row => ({
            id: row.ID,
            nombre: row.NOMBRE
        }));

    } catch (err) {
        console.error('Error en Usuario.findAll:', err);
        throw err;
    } finally {
        if (connection) await closeConnection(connection);
    }
}

static async findAllRoles() {
   let connection;
    try {
      connection = await getConnection();
      const sql = `SELECT * FROM vista_usuarios_roles`;
      const result = await connection.execute(sql, [], { outFormat: oracledb.OBJECT });
      return result.rows;
    } catch (err) {
      console.error('Error en Mascota.findAllRoles():', err);
      throw err;
    } finally {
      await closeConnection(connection);
    }
  }

   static async getNombreCompleto(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_usuario_nombre_completo(:id) AS nombre FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].NOMBRE;
    } catch (err) {
      console.error(`Error en Usuario.getNombreCompleto(${id}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async emailValido(email) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_email_valido(:email) AS valido FROM dual`,
        { email },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].VALIDO;
    } catch (err) {
      console.error(`Error en Usuario.emailValido(${email}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  static async normalizarTelefono(tel) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_normalizar_telefono(:tel) AS telefono FROM dual`,
        { tel },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0].TELEFONO;
    } catch (err) {
      console.error(`Error en Usuario.normalizarTelefono(${tel}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }
  
}
module.exports = Usuario;*/

const oracledb = require('oracledb');
const bcrypt = require('bcrypt');
const { getConnection, closeConnection } = require('../config/db');

class Usuario {

  static toNumber(value, nombreCampo) {
    const num = Number(value);
    if (isNaN(num)) throw new Error(`El campo ${nombreCampo} debe ser un número`);
    return num;
  }

  // CREATE usando paquete
  static async create({ nombre, apellido, email, password, telefono, rol }) {
    let connection;
    try {
      connection = await getConnection();
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await connection.execute(
        `BEGIN
           pkg_usuario.sp_create_usuario(
             :nombre, :apellido, :email, :password, :rol, :telefono, :id
           );
         END;`,
        {
          nombre,
          apellido,
          email: email.toLowerCase(),
          password: hashedPassword,
          rol,
          telefono: telefono || null,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        },
        { autoCommit: true }
      );

      return {
        id: result.outBinds.id,
        nombre,
        apellido,
        email: email.toLowerCase(),
        telefono,
        rol
      };

    } catch (err) {
      console.error('Error en Usuario.create:', err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ by email usando paquete
  static async findByEmail(email) {
    let connection;
    let cursor;
    try {
      connection = await getConnection();

      const result = await connection.execute(
        `BEGIN
           pkg_usuario.sp_get_usuario_by_email(:email, :cursor);
         END;`,
        {
          email: email.toLowerCase(),
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }
      );

      cursor = result.outBinds.cursor;
      const rows = await cursor.getRows(1); // solo un usuario
      await cursor.close();

      if (!rows || rows.length === 0) return null;

      const row = rows[0];
      return {
        id: row.ID,
        nombre: row.NOMBRE,
        apellido: row.APELLIDO,
        email: row.EMAIL,
        password: row.PASSWORD,
        telefono: row.TELEFONO,
        rol: row.NOMBRE_ROL
      };

    } catch (err) {
      console.error('Error en Usuario.findByEmail:', err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // READ all users usando paquete
static async findAll() {
  let connection;
  let cursor;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN pkg_usuario.sp_get_all_usuarios(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    cursor = result.outBinds.cursor;

    // Obtener todas las filas como arrays
    const rows = await cursor.getRows(1000); // máximo 1000 filas
    const columnNames = cursor.metaData.map(col => col.name); // extraer nombres de columnas
    await cursor.close();

    // Convertir arrays a objetos JSON
    return rows.map(row => {
      const obj = {};
      row.forEach((val, idx) => {
        obj[columnNames[idx]] = val;
      });
      return obj;
    });

  } catch (err) {
    console.error("Error en Usuario.findAll():", err);
    throw err;
  } finally {
    if (connection) await closeConnection(connection);
  }
}



  // UPDATE usando paquete
  static async update({ id, nombre, apellido, email, password, telefono, rol }) {
    let connection;
    try {
      connection = await getConnection();
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      await connection.execute(
        `BEGIN
           pkg_usuario.sp_update_usuario(
             :id, :nombre, :apellido, :email, :password, :rol, :telefono
           );
         END;`,
        {
          id,
          nombre,
          apellido,
          email: email?.toLowerCase(),
          password: hashedPassword,
          rol,
          telefono: telefono || null
        },
        { autoCommit: true }
      );

    } catch (err) {
      console.error('Error en Usuario.update:', err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // DELETE usando paquete
  static async delete(id) {
    let connection;
    try {
      connection = await getConnection();

      await connection.execute(
        `BEGIN
           pkg_usuario.sp_delete_usuario(:id);
         END;`,
        { id },
        { autoCommit: true }
      );

    } catch (err) {
      console.error('Error en Usuario.delete:', err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // AUTHENTICATE
  static async authenticateUser(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user || !user.password) return null;

      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : null;
    } catch (err) {
      console.error('Error en Usuario.authenticateUser:', err);
      throw err;
    }
  }

  // Listar roles desde vista
  static async findAllRoles() {
    let connection;
    try {
      connection = await getConnection();
      const sql = `SELECT * FROM vista_usuarios_roles`;
      const result = await connection.execute(sql, [], { outFormat: oracledb.OBJECT });
      return result.rows;
    } catch (err) {
      console.error('Error en Usuario.findAllRoles():', err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // Obtener nombre completo
  static async getNombreCompleto(id) {
    let connection;
    try {
      const idNum = this.toNumber(id, "id");
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_usuario_nombre_completo(:id) AS nombre FROM dual`,
        { id: idNum },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0]?.NOMBRE || null;
    } catch (err) {
      console.error(`Error en Usuario.getNombreCompleto(${id}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // Validar email
  static async emailValido(email) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_email_valido(:email) AS valido FROM dual`,
        { email },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0]?.VALIDO || false;
    } catch (err) {
      console.error(`Error en Usuario.emailValido(${email}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

  // Normalizar teléfono
  static async normalizarTelefono(tel) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute(
        `SELECT fn_normalizar_telefono(:tel) AS telefono FROM dual`,
        { tel },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0]?.TELEFONO || null;
    } catch (err) {
      console.error(`Error en Usuario.normalizarTelefono(${tel}):`, err);
      throw err;
    } finally {
      if (connection) await closeConnection(connection);
    }
  }

}

module.exports = Usuario;
