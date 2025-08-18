const Mascota = require('../models/mascota');

class MascotaService {

  // Obtener todas las mascotas
  async getAllMascotas() {
    try {
      return await Mascota.findAll();
    } catch (err) {
      console.error("Error en MascotaService.getAllMascotas():", err);
      throw err;
    }
  }

    // Obtener todas las mascotas Disponibles

  async getAllMascotasDisponibles() {
    try {
      return await Mascota.findAllDisponibles();
    } catch (err) {
      console.error("Error en MascotaService.getAllMascotasDisponibles():", err);
      throw err;
    }
  }

  
    // Obtener todas las mascotas adoptadas

  async getAllMascotasAdoptadas() {
    try {
      return await Mascota.findAllAdoptadas();
    } catch (err) {
      console.error("Error en MascotaService.getAllMascotasAdoptadas():", err);
      throw err;
    }
  }

  // Obtener mascota por ID
  async getMascotaById(id) {
    try {
      return await Mascota.findById(id);
    } catch (err) {
      console.error(`Error en MascotaService.getMascotaById(${id}):`, err);
      throw err;
    }
  }

  // Buscar mascotas por nombre o raza
  async searchMascotaByNombreOReza(text) {
    try {
      return await Mascota.searchByNameOrBreed(text);
    } catch (err) {
      console.error(`Error en MascotaService.searchMascotaByNombreOReza(${text}):`, err);
      throw err;
    }
  }

  // Crear una nueva mascota
  async createMascota(data) {
    try {
      return await Mascota.create(data);
    } catch (err) {
      console.error("Error en MascotaService.createMascota():", err);
      throw err;
    }
  }

  // Actualizar una mascota
  async updateMascota(id, data) {
    try {
      return await Mascota.update(id, data);
    } catch (err) {
      console.error(`Error en MascotaService.updateMascota(${id}):`, err);
      throw err;
    }
  }

  // Eliminar una mascota
  async deleteMascota(id) {
    try {
      return await Mascota.delete(id);
    } catch (err) {
      console.error(`Error en MascotaService.deleteMascota(${id}):`, err);
      throw err;
    }
  }

  async getCategoriaEdad(edad) {
    try {
      return await Mascota.getCategoriaEdad(edad);
    } catch (err) {
      console.error(`Error en MascotaService.getCategoriaEdad(${edad}):`, err);
      throw err;
    }
  }

  async getEstadoTexto(mascotaId) {
    try {
      return await Mascota.getEstadoTexto(mascotaId);
    } catch (err) {
      console.error(`Error en MascotaService.getEstadoTexto(${mascotaId}):`, err);
      throw err;
    }
  }

  async tieneHistorial(mascotaId) {
    try {
      return await Mascota.tieneHistorial(mascotaId);
    } catch (err) {
      console.error(`Error en MascotaService.tieneHistorial(${mascotaId}):`, err);
      throw err;
    }
  }

  async getTotalPorUsuario(usuarioId) {
    try {
      return await Mascota.getTotalPorUsuario(usuarioId);
    } catch (err) {
      console.error(`Error en MascotaService.getTotalPorUsuario(${usuarioId}):`, err);
      throw err;
    }
  }
}

module.exports = new MascotaService();
