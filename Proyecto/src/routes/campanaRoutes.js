const express = require('express');
const router = express.Router();
const campaniaController = require('../controllers/campaniaController');

// Obtener todas las campañas
router.get('/', campaniaController.getAllcampanias);

// Obtener campaña por ID
router.get('/:id', campaniaController.getcampaniaById);

// Buscar campañas por nombre (POST)
router.post('/search', campaniaController.searchcampaniaByNombre);

// Crear una nueva campaña
router.post('/', campaniaController.createcampania);

// Actualizar una campaña
router.put('/:id', campaniaController.updatecampania);

// Eliminar una campaña
router.delete('/:id', campaniaController.deletecampania);

module.exports = router;
