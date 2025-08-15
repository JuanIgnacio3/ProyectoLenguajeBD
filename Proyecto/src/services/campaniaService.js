const campania = require('../models/campania');

class campaniaService {
  // Obtener todas las campañas
  async getAllcampanias() {
    return await campania.findAll();
  }

  // Obtener campaña por ID
  async getcampaniaById(id) {
    return await campania.findById(id);
  }

  // Buscar campañas por nombre (si aplica)
  async searchcampaniaByNombre(nombre) {
    return await campania.searchByNombre(nombre);
  }

  // Crear una nueva campaña
  async createcampania(data) {
    return await campania.create(data);
  }

  // Actualizar una campaña
  async updatecampania(id, data) {
    return await campania.update(id, data);
  }

  // Eliminar una campaña
  async deletecampania(id) {
    return await campania.delete(id);
  }
}

module.exports = new campaniaService();
