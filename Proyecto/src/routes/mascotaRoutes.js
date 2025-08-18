const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');



// Obtener todas las mascotas
router.get('/', mascotaController.getAllMascotas);

// Obtener mascotas disponibles
router.get('/disponibles', mascotaController.getAllMascotasDisponibles);

// Obtener mascotas adoptadas
router.get('/adoptadas', mascotaController.getAllMascotasAdoptadas);

// Obtener mascota por ID
router.get('/:id', mascotaController.getMascotaById);

// Buscar mascotas por nombre o raza (query string ?q=texto)
router.get('/search', mascotaController.searchMascotaByNombreOReza);

// Crear una nueva mascota
router.post('/', mascotaController.createMascota);

// Actualizar una mascota
router.put('/:id', mascotaController.updateMascota);

// Eliminar una mascota
router.delete('/:id', mascotaController.deleteMascota);

router.get('/:edad/categoria', mascotaController.getCategoriaEdad.bind(mascotaController));
router.get('/:id/estado', mascotaController.getEstadoTexto.bind(mascotaController));
router.get('/:id/historial', mascotaController.tieneHistorial.bind(mascotaController));

router.get('/usuario/:id/total', mascotaController.getTotalPorUsuario.bind(mascotaController));

module.exports = router;
