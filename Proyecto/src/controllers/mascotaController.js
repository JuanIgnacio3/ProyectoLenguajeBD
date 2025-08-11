const mascotaService = require('../services/mascotaService');

class MascotaController {
  // Obtener todas las mascotas
  async getAllMascotas(req, res) {
    try {
      const mascotas = await mascotaService.getAllMascotas();
      res.status(200).json(mascotas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener mascota por ID
  async getMascotaById(req, res) {
    try {
      const mascota = await mascotaService.getMascotaById(req.params.id);
      if (mascota) {
        res.status(200).json(mascota);
      } else {
        res.status(404).json({ error: 'Mascota no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Buscar mascotas por nombre
  async searchMascotaByNombre(req, res) {
    try {
      const mascotas = await mascotaService.searchMascotaByNombre(req.body.search);
      res.status(200).json(mascotas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Crear una nueva mascota
  async createMascota(req, res) {
    try {
      const mascota = await mascotaService.createMascota(req.body);
      res.status(201).json(mascota);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar una mascota
  async updateMascota(req, res) {
    try {
      const mascota = await mascotaService.updateMascota(req.params.id, req.body);
      if (mascota) {
        res.status(200).json(mascota);
      } else {
        res.status(404).json({ error: 'Mascota no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar una mascota
  async deleteMascota(req, res) {
    try {
      const success = await mascotaService.deleteMascota(req.params.id);
      if (success) {
        res.status(200).json({ message: 'Mascota eliminada correctamente' });
      } else {
        res.status(404).json({ error: 'Mascota no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new MascotaController();
