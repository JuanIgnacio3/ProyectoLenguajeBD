const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getConnection, closeConnection, getNextSeqValue } = require('./db');
const Usuario = require('../models/usuario');
const authRoutes = require('../routes/authRoutes');
const usuarioRoutes = require('../routes/usuarioRoutes');
const oracledb = require('oracledb');



const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Endpoint para obtener todos los empleados
app.get('/empleados', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM USUARIOS`,
      [],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al consultar la base de datos');
  } finally {
    await closeConnection(connection);
  }
});

// Endpoint para obtener el próximo valor de secuencia
app.get('/next-id', async (req, res) => {
  try {
    const nextId = await getNextSeqValue('seq_usuarios');
    res.json({ nextId });
  } catch (err) {
    res.status(500).send('Error al obtener el siguiente ID');
  }
});

// Crear usuario
app.post('/api/users', async (req, res) => {
  try {
    const user = await Usuario.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Autenticación de usuario
app.post('/api/users/auth', async (req, res) => {
  const { email, password } = req.body;
  let connection;

  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM usuarios WHERE email = :email AND password = :password`,
      [email, password],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        ID: user.ID,
        NOMBRE: user.NOMBRE,
        APELLIDO: user.APELLIDO,
        EMAIL: user.EMAIL,
        ROL: user.ROL
      });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error de servidor' });
  } finally {
    await closeConnection(connection);
  }
});

// Rutas externas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
