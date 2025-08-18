const express = require('express');
const router = express.Router();
const campaniaController = require('../controllers/campaniaController');

// Obtener todas las campañas
router.get('/', campaniaController.getAllCampanias);

router.get('/activas', campaniaController.getAllCampaniasActivas);

router.get('/inactivas', campaniaController.getAllCampaniasInactivas);

// Obtener campaña por ID
router.get('/:id', campaniaController.getCampaniaById);

// Buscar campañas por nombre
router.get('/search', campaniaController.searchCampaniaByNombre);



router.get('/:id/recaudado', campaniaController.getTotalRecaudado);


// Crear nueva campaña
router.post('/', campaniaController.createCampania);

// Actualizar campaña
router.put('/:id', campaniaController.updateCampania);

// Eliminar campaña
router.delete('/:id', campaniaController.deleteCampania);

router.get('/:id/porcentaje', campaniaController.getPorcentajeAvance.bind(campaniaController)); 

router.get('/:id/dias', campaniaController.getDiasRestantes.bind(campaniaController)); 


module.exports = router;
