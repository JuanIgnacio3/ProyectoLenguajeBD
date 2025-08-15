const authService = require('../services/authService');
const { validationResult } = require('express-validator');

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
            const result = await authService.registerUser(req.body);

            if (result.success) {
                req.flash('success', 'Registro exitoso. Por favor inicie sesión.');
                return res.redirect('/auth/login');
            } else {
                req.flash('error', result.message || 'Error en el registro');
                req.flash('formData', req.body);
                return res.redirect('/auth/register');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            req.flash('error', 'Error interno del servidor');
            req.flash('formData', req.body);
            return res.redirect('/auth/register');
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
            req.flash('error', errors.array().map(err => err.msg));
            req.flash('email', req.body.email);
            return res.redirect('/auth/login');
        }

        try {
            const { email, password } = req.body;
            const user = await authService.authenticateUser(email, password);

            if (user) {
                // Aquí podrías iniciar sesión con req.login si usas Passport
                req.flash('success', `Bienvenido ${user.nombre}`);
                return res.redirect('/'); // Redirige a home o dashboard
            } else {
                req.flash('error', 'Credenciales inválidas');
                req.flash('email', email);
                return res.redirect('/auth/login');
            }
        } catch (error) {
            console.error('Error en login:', error);
            req.flash('error', 'Error interno del servidor');
            return res.redirect('/auth/login');
        }
    }

    // Cerrar sesión
    logout(req, res) {
        // Si usas sesiones
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
        if (req.user) {
            return next();
        }
        req.flash('error', 'Por favor inicie sesión para continuar');
        return res.redirect('/auth/login');
    }

    // Middleware para verificar roles
    ensureRole(role) {
        return (req, res, next) => {
            if (req.user && req.user.rol === role) {
                return next();
            }
            req.flash('error', 'No autorizado');
            return res.redirect('/');
        };
    }
}

module.exports = new AuthController();
