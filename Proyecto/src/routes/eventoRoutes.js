const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

// Obtener todos los eventos
router.get('/', eventoController.getAllEventos);

router.get('/virtuales', eventoController.getAllEventosVirtuales);

router.get('/presenciales', eventoController.getAllEventosPresenciales);

// Obtener evento por ID
router.get('/:id', eventoController.getEventoById);

// Buscar eventos por título
router.get('/search/:nombre', eventoController.searchEventoByNombre);

// Crear un nuevo evento
router.post('/', eventoController.createEvento);

// Actualizar un evento existente
router.put('/:id', eventoController.updateEvento);

// Eliminar un evento
router.delete('/:id', eventoController.deleteEvento);


router.get('/:id/estado', eventoController.getEstadoTexto.bind(eventoController)); 
router.get('/:id/asistentes', eventoController.getAsistentes.bind(eventoController)); 

module.exports = router;
