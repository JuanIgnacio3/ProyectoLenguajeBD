const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// Obtener todos los inventarios
router.get('/', inventarioController.getAllInventarios);

router.get('/donacion', inventarioController.getAllInventariosDonacion);

router.get('/compra', inventarioController.getAllInventariosCompra);

router.get('/caducidad', inventarioController.getAllInventariosCaducidad);

// Obtener inventario por ID
router.get('/:id', inventarioController.getInventarioById);

// Buscar inventarios por nombre (POST)
router.post('/search', inventarioController.searchInventarioByTipo);

// Crear un nuevo inventario
router.post('/', inventarioController.createInventario);

// Actualizar un inventario
router.put('/:id', inventarioController.updateInventario);

// Eliminar un inventario
router.delete('/:id', inventarioController.deleteInventario);


router.get('/:id/vencido', inventarioController.estaVencido.bind(inventarioController));

module.exports = router;
