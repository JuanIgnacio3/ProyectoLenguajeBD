const campaniaService = require('../services/campaniaService');

class CampaniaController {
  // Obtener todas las campañas
  async getAllCampanias(req, res) {
    try {
      const campanias = await campaniaService.getAllCampanias();
      res.status(200).json(campanias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

    // Obtener todas las campañas activas
  async getAllCampaniasActivas(req, res) {
    try {
      const campanias = await campaniaService.getAllCampaniasActivas();
      res.status(200).json(campanias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

    // Obtener todas las campañas Inactivas
  async getAllCampaniasInactivas(req, res) {
    try {
      const campanias = await campaniaService.getAllCampaniasInactivas();
      res.status(200).json(campanias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

   async getTotalRecaudado(req, res) {
    try {
      const campanias = await campaniaService.getTotalRecaudado(req.params.id);
      res.status(200).json(campanias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener campaña por ID
  async getCampaniaById(req, res) {
    try {
      const campania = await campaniaService.getCampaniaById(req.params.id);
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
  async searchCampaniaByNombre(req, res) {
    try {
      const query = req.query.q || '';
      const campanias = await campaniaService.searchCampaniaByNombre(query);
      res.status(200).json(campanias);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Crear nueva campaña
  async createCampania(req, res) {
    try {
      const campania = await campaniaService.createCampania(req.body);
      
      res.status(201).json({ success: true, campania }); // <-- Aquí
    } catch (error) {
      res.status(400).json({ success: false, message: error.message }); // <-- Y aquí
    }
  }


  // Actualizar campaña
  async updateCampania(req, res) {
    try {
      const campania = await campaniaService.updateCampania(req.params.id, req.body);
      if (!campania) {
          return res.status(404).json({ success: false, message: 'Campania no encontrada o no se modificaron los datos' });
        }
  
        // Actualización exitosa
        res.status(200).json({ success: true, campania });
  
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    }

  
    

  // Eliminar campaña
  async deleteCampania(req, res) {
    try {
      const success = await campaniaService.deleteCampania(req.params.id);
      if (success) {
        res.status(200).json({ message: 'Campaña eliminada correctamente' });
      } else {
        res.status(404).json({ error: 'Campaña no encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

    async getPorcentajeAvance(req, res) {
    try {
      const porcentaje = await campaniaService.getPorcentajeAvance(req.params.id);
      res.status(200).json({ porcentaje });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDiasRestantes(req, res) {
    try {
      const dias = await campaniaService.getDiasRestantes(req.params.id);
      res.status(200).json({ dias });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}




module.exports = new CampaniaController();
