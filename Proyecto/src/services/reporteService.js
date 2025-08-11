const Reporte = require('../models/reporte');

class ReporteService {
  // Obtener todas las Reportes
  async getAllReportes() {
    return await Reporte.findAll();
  }

  // Obtener Reporte por ID
  async getReporteById(id) {
    return await Reporte.findById(id);
  }

  // Buscar Reportes por nombre (si aplica)
  async searchReporteByNombre(nombre) {
    return await Reporte.searchByNombre(nombre);
  }

  // Crear un nuevo Reporte
  async createReporte(data) {
    return await Reporte.create(data);
  }

  // Actualizar un Reporte
  async updateReporte(id, data) {
    return await Reporte.update(id, data);
  }

  // Eliminar un Reporte
  async deleteReporte(id) {
    return await Reporte.delete(id);
  }
}

module.exports = new ReporteService();
