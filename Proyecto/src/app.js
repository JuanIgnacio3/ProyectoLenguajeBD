const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// -----------------------------------
// Middlewares
// -----------------------------------



// CORS (para desarrollo)
app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true
}));

// Parseo de JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
  secret: 'tu_super_secreto_sesion', // Cambiar en producción
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  }
}));

// Flash messages
app.use(flash());

// Variables globales para templates y mensajes
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});

// -----------------------------------
// Rutas
// -----------------------------------

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Rutas API
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/mascotas', require('./routes/mascotaRoutes'));
app.use('/api/campanias', require('./routes/campaniaRoutes'));
app.use('/api/voluntarios', require('./routes/voluntarioRoutes'));
app.use('/api/reportes', require('./routes/reporteRoutes'));
app.use('/api/inventarios', require('./routes/inventarioRoutes'));
app.use('/api/eventos', require('./routes/eventoRoutes'));



// Otras rutas
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use(express.static('public'));

// Archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// -----------------------------------
// Inicio del servidor
// -----------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
