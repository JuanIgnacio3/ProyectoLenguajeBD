const oracledb = require('oracledb');
const { getConnection, closeConnection } = require('./db'); // Ajusta la ruta si es necesario

async function testMascotas() {
  let connection;
  try {
    connection = await getConnection();

    const sql = `SELECT id, nombre, raza, edad, descripcion, foto, estado, usuario FROM Mascotas`;
    console.log('Ejecutando query:', sql);

    const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    console.log('Filas obtenidas:', result.rows.length);
    console.log('Primeras filas:', result.rows.slice(0, 5));
  } catch (err) {
    console.error('Error ejecutando query de prueba:', err);
  } finally {
    await closeConnection(connection);
  }
}

testMascotas();