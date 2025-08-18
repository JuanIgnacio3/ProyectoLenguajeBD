const voluntarioService = require('../services/voluntarioService');


class VoluntarioController {
  async getAllVoluntarios(req, res) {
    try {
      const voluntarios = await voluntarioService.getAllVoluntarios();
      res.status(200).json(voluntarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getVoluntarioById(req, res) {
    try {
      const voluntario = await voluntarioService.getVoluntarioById(req.params.id);
      if (voluntario) {
        res.status(200).json(voluntario);
      } else {
        res.status(404).json({ error: 'Voluntario no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async searchVoluntarioByNombre(req, res) {
    try {
      const voluntario = await voluntarioService.searchVoluntarioByNombre(req.body.search);
      res.status(200).json(voluntario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createVoluntario(req, res) {
    try {
      const voluntario = await voluntarioService.createVoluntario(req.body);
      res.status(201).json({ success: true, voluntario }); // <-- Aquí
    } catch (error) {
      res.status(400).json({ success: false, message: error.message }); // <-- Y aquí
    }
  }

  async updateVoluntario(req, res) {
    try {
      const voluntario = await voluntarioService.updateVoluntario(req.params.id, req.body);
      if (!voluntario) {
        return res.status(404).json({ success: false, message: 'Voluntario no encontrada o no se modificaron los datos' });
      }

      // Actualización exitosa
      res.status(200).json({ success: true, voluntario});

    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }



  async deleteVoluntario(req, res) {
    try {
      const success = await voluntarioService.deleteVoluntario(req.params.id);
      if (success) {
        res.status(200).json({ message: 'Voluntario eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Voluntario no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

   async getHoras(req, res) {
    try {
      const horas = await voluntarioService.getHoras(req.params.id);
      res.status(200).json({ horas });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async esVoluntario(req, res) {
    try {
      const es = await voluntarioService.esVoluntario(req.params.id);
      res.status(200).json({ es });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new VoluntarioController();