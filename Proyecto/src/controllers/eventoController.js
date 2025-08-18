const eventoService = require('../services/eventoService');

class EventoController {
  // Obtener todos los eventos
  async getAllEventos(req, res) {
    try {
      const eventos = await eventoService.getAllEventos();
      res.status(200).json(eventos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllEventosVirtuales(req, res) {
    try {
      const eventos = await eventoService.getAllEventosVirtuales();
      res.status(200).json(eventos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllEventosPresenciales(req, res) {
    try {
      const eventos = await eventoService.getAllEventosPresenciales();
      res.status(200).json(eventos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obtener evento por ID
  async getEventoById(req, res) {
    try {
      const evento = await eventoService.getEventoById(req.params.id);
      if (evento) {
        res.status(200).json(evento);
      } else {
        res.status(404).json({ error: 'Evento no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Buscar eventos por nombre
  async searchEventoByNombre(req, res) {
    try {
      const eventos = await eventoService.searchEventoByNombre(req.body.search);
      res.status(200).json(eventos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Crear un nuevo evento
  async createEvento(req, res) {
    try {
      const evento = await eventoService.createEvento(req.body);
      res.status(201).json({ success: true, evento }); // <-- respuesta compatible
    } catch (error) {
      res.status(400).json({ success: false, message: error.message }); // <-- respuesta de error
    }
  }


  // Actualizar un evento
 async updateEvento(req, res) {
  try {
    const evento = await eventoService.updateEvento(req.params.id, req.body);

    if (!evento) {
      // No se encontró el evento o no se modificaron los datos
      return res.status(404).json({ success: false, message: 'Evento no encontrado o no se modificaron los datos' });
    }

    // Actualización exitosa
    res.status(200).json({ success: true, evento });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}


   

  // Eliminar un evento
  async deleteEvento(req, res) {
    try {
      const success = await eventoService.deleteEvento(req.params.id);
      if (success) {
        res.status(200).json({ message: 'Evento eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Evento no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

   async getEstadoTexto(req, res) {
    try {
      const estado = await eventoService.getEstadoTexto(req.params.id);
      res.status(200).json({ estado });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAsistentes(req, res) {
    try {
      const asistentes = await eventoService.getAsistentes(req.params.id);
      res.status(200).json({ asistentes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}

module.exports = new EventoController();
