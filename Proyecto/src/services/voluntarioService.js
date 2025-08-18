const Voluntario = require('../models/voluntario');
const { getConnection, closeConnection } = require('../config/db');

class VoluntarioService {
  // Obtener todos los voluntarios
  async getAllVoluntarios() {
    return await Voluntario.findAll();
  }

  // Obtener voluntario por ID
  async getVoluntarioById(id) {
    return await Voluntario.findById(id);
  }

  // Buscar voluntarios por nombre (si aplica)
  async searchVoluntarioByNombre(nombre) {
    return await Voluntario.searchByNombre(nombre);
  }

  // Crear una nuevo voluntario
  async createVoluntario(data) {
    return await Voluntario.create(data);
  }

  // Actualizar un voluntario
  async updateVoluntario(id, data) {
    return await Voluntario.update(id, data);
  }

  // Eliminar un voluntario
  async deleteVoluntario(id) {
    return await Voluntario.delete(id);
  }

  async getHoras(voluntarioId) {
    try {
      return await Voluntario.getHoras(voluntarioId);
    } catch (err) {
      console.error(`Error en VoluntarioService.getHoras(${voluntarioId}):`, err);
      throw err;
    }
  }

  async esVoluntario(usuarioId) {
    try {
      return await Voluntario.esVoluntario(usuarioId);
    } catch (err) {
      console.error(`Error en VoluntarioService.esVoluntario(${usuarioId}):`, err);
      throw err;
    }
  }
}

module.exports = new VoluntarioService();
