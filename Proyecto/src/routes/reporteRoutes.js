const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

// Obtener todos los reportes
router.get('/', reporteController.getAllReportes);

// Obtener reporte por ID
router.get('/:id', reporteController.getReporteById);

// Buscar reportes por nombre (POST)
router.post('/search', reporteController.searchReporteByTipo);

// Crear un nuevo reporte
router.post('/', reporteController.createReporte);

// Actualizar un reporte
router.put('/:id', reporteController.updateReporte);

// Eliminar un reporte
router.delete('/:id', reporteController.deleteReporte);

module.exports = router;
