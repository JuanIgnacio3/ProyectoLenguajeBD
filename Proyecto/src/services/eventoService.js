const Evento = require('../models/evento');
const { getConnection, closeConnection } = require('../config/db');

class EventoService {
  // Obtener todos los eventos
  async getAllEventos() {
    return await Evento.findAll();
  }

   async getAllEventosVirtuales() {
    return await Evento.findAllVirtuales();
  }

   async getAllEventosPresenciales() {
    return await Evento.findAllPresenciales();
  }

  // Obtener evento por ID
  async getEventoById(id) {
    return await Evento.findById(id);
  }

  // Buscar eventos por nombre
  async searchEventoByNombre(nombre) {
    return await Evento.searchByNombre(nombre);
  }

  // Crear evento
  async createEvento(data) {
    return await Evento.create(data);
  }

  // Actualizar evento
  //async updateEvento(id, evento) {
   // return await Evento.update(id, evento);
 // }

  async updateEvento(id, evento) {
  const { nombre, descripcion, fecha, ubicacion, responsable, tipo, estado } = evento;
  return await Evento.update(id, nombre, descripcion, fecha, ubicacion, responsable, tipo, estado);
}

  // Eliminar evento
  async deleteEvento(id) {
    return await Evento.delete(id);
  }

    async getEstadoTexto(id) {
    try {
      return await Evento.getEstadoTexto(id);
    } catch (err) {
      console.error(`Error en EventoService.getEstadoTexto(${id}):`, err);
      throw err;
    }
  }

  async getAsistentes(id) {
    try {
      return await Evento.getAsistentes(id);
    } catch (err) {
      console.error(`Error en EventoService.getAsistentes(${id}):`, err);
      throw err;
    }
  }
}

module.exports = new EventoService();
