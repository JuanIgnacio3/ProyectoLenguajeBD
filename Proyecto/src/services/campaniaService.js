

const Campania = require('../models/campania');

class CampaniaService {
  // Obtener todas las campañas
  async getAllCampanias() {
    try {
      return await Campania.findAll();
    } catch (err) {
      console.error("Error en CampaniaService.getAllCampanias():", err);
      throw err;
    }
  }

  // Obtener todas las campañas activas
  async getAllCampaniasActivas() {
    try {
      return await Campania.findAllActivas();
    } catch (err) {
      console.error("Error en CampaniaService.getAllCampaniasActivas():", err);
      throw err;
    }
  }

  // Obtener todas las campañas inactivas
  async getAllCampaniasInactivas() {
    try {
      return await Campania.findAllInactivas();
    } catch (err) {
      console.error("Error en CampaniaService.getAllCampaniasInactivas():", err);
      throw err;
    }
  }

  // Obtener campaña por ID
  async getCampaniaById(id) {
    try {
      return await Campania.findById(id);
    } catch (err) {
      console.error(`Error en CampaniaService.getCampaniaById(${id}):`, err);
      throw err;
    }
  }

  async getTotalRecaudado(id) {
  try {
    return await Campania.getTotalRecaudado(id);
  } catch (err) {
    console.error(`Error en CampaniaService.getTotalRecaudado(${id}):`, err);
    throw err;
  }
}


  // Buscar campañas por nombre
  async searchCampaniaByNombre(nombre) {
    try {
      return await Campania.searchByNombre(nombre);
    } catch (err) {
      console.error(`Error en CampaniaService.searchCampaniaByNombre(${nombre}):`, err);
      throw err;
    }
  }

  // Crear nueva campaña
  async createCampania(data) {
    try {
      return await Campania.create(data);
    } catch (err) {
      console.error("Error en CampaniaService.createCampania():", err);
      throw err;
    }
  }

  // Actualizar campaña
  async updateCampania(id, data) {
    try {
      return await Campania.update(id, data);
    } catch (err) {
      console.error(`Error en CampaniaService.updateCampania(${id}):`, err);
      throw err;
    }
  }

  // Eliminar campaña
  async deleteCampania(id) {
    try {
      return await Campania.delete(id);
    } catch (err) {
      console.error(`Error en CampaniaService.deleteCampania(${id}):`, err);
      throw err;
    }
  }


  async getPorcentajeAvance(id) {
    try {
      return await Campania.getPorcentajeAvance(id);
    } catch (err) {
      console.error(`Error en CampaniaService.getPorcentajeAvance(${id}):`, err);
      throw err;
    }
  }

  async getDiasRestantes(id) {
    try {
      return await Campania.getDiasRestantes(id);
    } catch (err) {
      console.error(`Error en CampaniaService.getDiasRestantes(${id}):`, err);
      throw err;
    }
  }
}

module.exports = new CampaniaService();

