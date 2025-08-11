const Mascota = require('../models/mascota');

class MascotaService {
  // Obtener todas las mascotas
  async getAllMascotas() {
    return await Mascota.findAll();
  }

  // Obtener mascota por ID
  async getMascotaById(id) {
    return await Mascota.findById(id);
  }

  // Buscar mascotas por nombre
  async searchMascotaByNombre(nombre) {
    return await Mascota.searchByNombre(nombre);
  }

  // Crear una nueva mascota
  async createMascota(data) {
    return await Mascota.create(data);
  }

  // Actualizar una mascota
  async updateMascota(id, data) {
    return await Mascota.update(id, data);
  }

  // Eliminar una mascota
  async deleteMascota(id) {
    return await Mascota.delete(id);
  }
}

module.exports = new MascotaService();
