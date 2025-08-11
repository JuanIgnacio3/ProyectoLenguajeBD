const express = require('express');
const router = express.Router();
const inventariosController = require('../controllers/inventarioController');

// Obtener todos los inventarios
router.get('/', inventarioController.getAllInventarios);

// Obtener inventario por ID
router.get('/:id', inventarioController.getInventarioById);

// Buscar inventarios por nombre (POST)
router.post('/search', inventarioController.searchInventarioByNombre);

// Crear un nuevo inventario
router.post('/', inventarioController.createInventario);

// Actualizar un inventario
router.put('/:id', inventarioController.updateInventario);

// Eliminar un inventario
router.delete('/:id', inventarioController.deleteInventario);

module.exports = router;
