const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Registro de usuario
router.post("/register", (req, res) => usuarioController.create(req, res));

// Login de usuario
router.post("/login", (req, res) => usuarioController.login(req, res));

// Buscar usuarios (poner antes de "/:id")
router.get("/search", (req, res) => usuarioController.search(req, res));

// Obtener todos los usuarios
router.get("/", (req, res) => usuarioController.getAll(req, res));

router.get("/usuarios", (req, res) => usuarioController.getAllRoles(req, res));


// Obtener un usuario por ID
router.get("/:id", (req, res) => usuarioController.getById(req, res));

// Actualizar usuario
router.put("/:id", (req, res) => usuarioController.update(req, res));

// Eliminar usuario
router.delete("/:id", (req, res) => usuarioController.delete(req, res));

router.get('/:id/nombre', usuarioController.getNombreCompleto.bind(usuarioController));
router.get('/:email/email-valido', usuarioController.emailValido.bind(usuarioController));
router.get('/:tel/normalizar-telefono', usuarioController.normalizarTelefono.bind(usuarioController));
module.exports = router;
