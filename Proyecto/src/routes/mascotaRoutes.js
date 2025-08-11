const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');

// Obtener todas las mascotas
router.get('/', mascotaController.getAllMascotas);

// Obtener mascota por ID
router.get('/:id', mascotaController.getMascotaById);

// Buscar mascotas por nombre (puede ser POST o GET, aquí uso POST según tu controlador)
router.post('/search', mascotaController.searchMascotaByNombre);

// Crear una nueva mascota
router.post('/', mascotaController.createMascota);

// Actualizar una mascota
router.put('/:id', mascotaController.updateMascota);

// Eliminar una mascota
router.delete('/:id', mascotaController.deleteMascota);

module.exports = router;
