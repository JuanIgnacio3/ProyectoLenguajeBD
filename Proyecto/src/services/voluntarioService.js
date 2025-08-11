const Voluntario = require('../models/voluntario');

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
}

module.exports = new VoluntarioService();
