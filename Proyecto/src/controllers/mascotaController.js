const mascotaService = require('../services/mascotaService');


class MascotaController {
  // Obtener todas las mascotas
  async getAllMascotas(req, res) {
    try {
      const mascotas = await mascotaService.getAllMascotas();
      res.status(200).json(mascotas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

    // Obtener todas las mascotas disponibles

   async getAllMascotasDisponibles(req, res) {
    try {
      const mascotas = await mascotaService.getAllMascotasDisponibles();
      res.status(200).json(mascotas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener todas las mascotas adoptadas

  async getAllMascotasAdoptadas(req, res) {
    try {
      const mascotas = await mascotaService.getAllMascotasAdoptadas();
      res.status(200).json(mascotas);
    } catch (error) {
      res.status(500).json({ error: error.message });
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

  // Buscar mascotas por nombre o raza
  async searchMascotaByNombreOReza(req, res) {
    try {
      const query = req.query.q || '';
      const mascotas = await mascotaService.searchMascotaByNombreOReza(query);
      res.status(200).json(mascotas);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Crear una nueva mascota
  async createMascota(req, res) {
    try {
      const mascota = await mascotaService.createMascota(req.body);
      res.status(201).json({ success: true, mascota }); // <-- Aquí
    } catch (error) {
      res.status(400).json({ success: false, message: error.message }); // <-- Y aquí
    }
  }

  async updateMascota(req, res) {
    try {
      const mascota = await mascotaService.updateMascota(req.params.id, req.body);

      if (!mascota) {
        // No se encontró la mascota o no se modificaron los datos
        return res.status(404).json({ success: false, message: 'Mascota no encontrada o no se modificaron los datos' });
      }

      // Actualización exitosa
      res.status(200).json({ success: true, mascota });

    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
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

   async getCategoriaEdad(req, res) {
    try {
      const categoria = await mascotaService.getCategoriaEdad(req.params.edad);
      res.status(200).json({ categoria });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEstadoTexto(req, res) {
    try {
      const estado = await mascotaService.getEstadoTexto(req.params.id);
      res.status(200).json({ estado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async tieneHistorial(req, res) {
    try {
      const tiene = await mascotaService.tieneHistorial(req.params.id);
      res.status(200).json({ tiene });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTotalPorUsuario(req, res) {
    try {
      const total = await mascotaService.getTotalPorUsuario(req.params.id);
      res.status(200).json({ total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MascotaController();
