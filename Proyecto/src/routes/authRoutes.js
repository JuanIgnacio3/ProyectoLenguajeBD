const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

// Registro
router.post('/register', [
    check('nombre').notEmpty().withMessage('El nombre es requerido'),
    check('apellido').notEmpty().withMessage('El apellido es requerido'),
    check('email').isEmail().withMessage('Email inválido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], authController.register);

// Login
router.post('/login', [
    check('email').isEmail().withMessage('Email inválido'),
    check('password').notEmpty().withMessage('La contraseña es requerida')
], authController.login);

// Logout (opcional si manejas sesiones JWT)
router.get('/logout', authController.logout);


module.exports = router;