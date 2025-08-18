const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');

// Obtener todos las voluntarios
router.get('/', voluntarioController.getAllVoluntarios);

// Obtener voluntario por ID
router.get('/:id', voluntarioController.getVoluntarioById);

// Buscar voluntarios por nombre (POST)
router.post('/search', voluntarioController.searchVoluntarioByNombre);

// Crear un nuevo voluntario
router.post('/', voluntarioController.createVoluntario);

// Actualizar un voluntario
router.put('/:id', voluntarioController.updateVoluntario);

// Eliminar un voluntario
router.delete('/:id', voluntarioController.deleteVoluntario);

router.get('/:id/horas', voluntarioController.getHoras.bind(voluntarioController));
router.get('/:id/es-voluntario', voluntarioController.esVoluntario.bind(voluntarioController));

module.exports = router;
