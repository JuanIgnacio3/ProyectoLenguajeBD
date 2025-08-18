const { validationResult } = require("express-validator");
const Usuario = require("../models/usuario");
const bcrypt = require('bcrypt');



class AuthController {

    // Mostrar formulario de registro
    showRegistrationForm(req, res) {
        res.render('auth/register', {
            successMessage: req.flash('success'),
            errorMessage: req.flash('error'),
            formData: req.flash('formData')[0] || {}
        });
    }

    // Procesar registro
    async register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(err => err.msg));
            req.flash('formData', req.body);
            return res.redirect('/auth/register');
        }

        try {
            const { nombre, apellido, email, password, telefono, rol } = req.body;

            // Hashear la contraseña antes de guardar
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear usuario usando el modelo
            const nuevoUsuario = await Usuario.create({
                nombre,
                apellido,
                email: email.toLowerCase(), // guardar siempre en minúscula
                password: hashedPassword,
                telefono,
                rol
            });

            req.flash('success', 'Registro exitoso. Por favor inicie sesión.');
            res.redirect('/auth/login');

        } catch (error) {
            console.error('Error en registro:', error);
            req.flash('error', 'Error interno del servidor');
            req.flash('formData', req.body);
            res.redirect('/auth/register');
        }
    }

    // Mostrar formulario de login
    showLoginForm(req, res) {
        res.render('auth/login', {
            errorMessage: req.flash('error'),
            email: req.flash('email')[0] || ''
        });
    }

    // Procesar login
    async login(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array().map(err => err.msg).join(', ') });
        }

        try {
            const { email, password } = req.body;

            // Autenticar usando el modelo Usuario
            const usuario = await Usuario.authenticateUser(email.toLowerCase(), password);

            if (!usuario) {
                return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
            }

            // Guardar usuario en sesión
            req.session.user = {
                ID: usuario.ID,
                NOMBRE: usuario.NOMBRE,
                APELLIDO: usuario.APELLIDO,
                EMAIL: usuario.EMAIL,
                ROL: usuario.ROL
            };

            // Enviar datos al frontend
            res.json({
                ID: usuario.ID,
                NOMBRE: usuario.NOMBRE,
                APELLIDO: usuario.APELLIDO,
                EMAIL: usuario.EMAIL,
                TELEFONO: usuario.TELEFONO,
                ROL: usuario.ROL
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Cerrar sesión
    logout(req, res) {
        if (req.session) {
            req.session.destroy(err => {
                if (err) console.error(err);
                res.redirect('/auth/login');
            });
        } else {
            res.redirect('/auth/login');
        }
    }

    // Middleware para verificar autenticación
    ensureAuthenticated(req, res, next) {
        if (req.session && req.session.user) return next();
        req.flash('error', 'Por favor inicie sesión para continuar');
        return res.redirect('/auth/login');
    }

    // Middleware para verificar roles
    ensureRole(role) {
        return (req, res, next) => {
            if (req.session && req.session.user && req.session.user.ROL === role) return next();
            req.flash('error', 'No autorizado');
            return res.redirect('/');
        };
    }
}

module.exports = new AuthController();
