const Inventario = require('../models/inventario');

class InventarioService {
  // Obtener todas las Inventarios
  async getAllInventarios() {
    return await Inventario.findAll();
  }

  // Obtener Inventario por ID
  async getInventarioById(id) {
    return await Inventario.findById(id);
  }

  // Buscar Inventarios por nombre (si aplica)
  async searchInventarioByNombre(nombre) {
    return await Inventario.searchByNombre(nombre);
  }

  // Crear un nuevo Inventario
  async createInventario(data) {
    return await Inventario.create(data);
  }

  // Actualizar un Inventario
  async updateInventario(id, data) {
    return await Inventario.update(id, data);
  }

  // Eliminar un Inventario
  async deleteInventario(id) {
    return await Inventario.delete(id);
  }
}

module.exports = new InventarioService();
