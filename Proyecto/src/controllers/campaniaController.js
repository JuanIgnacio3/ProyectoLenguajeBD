const campaniaService = require('../services/campaniaService');

class campaniaController {
  // Obtener todas las campañas
  async getAllcampanias(req, res) {
    try {
      const campanias = await campaniaService.getAllcampanias();
      res.status(200).json(campanias);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener campaña por ID
  async getcampaniaById(req, res) {
    try {
      const campania = await campaniaService.getcampaniaById(req.params.id);
      if (campania) {
        res.status(200).json(campania);
      } else {
        res.status(404).json({ error: 'Campaña no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Buscar campañas por nombre
  async searchcampaniaByNombre(req, res) {
    try {
      const campanias = await campaniaService.searchcampaniaByNombre(req.body.search);
      res.status(200).json(campanias);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Crear nueva campaña
  async createcampania(req, res) {
    try {
      const campania = await campaniaService.createcampania(req.body);
      res.status(201).json(campania);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Actualizar campaña
  async updatecampania(req, res) {
    try {
      const campania = await campaniaService.updatecampania(req.params.id, req.body);
      if (campania) {
        res.status(200).json(campania);
      } else {
        res.status(404).json({ error: 'Campaña no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Eliminar campaña
  async deletecampania(req, res) {
    try {
      const success = await campaniaService.deletecampania(req.params.id);
      if (success) {
        res.status(200).json({ message: 'Campaña eliminada correctamente' });
      } else {
        res.status(404).json({ error: 'Campaña no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new campaniaController();
