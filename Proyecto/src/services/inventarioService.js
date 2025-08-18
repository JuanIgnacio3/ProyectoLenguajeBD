const Inventario = require('../models/inventario');
const { getConnection, closeConnection } = require('../config/db');

class InventarioService {
  // Obtener todas las Inventarios
  async getAllInventarios() {
    return await Inventario.findAll();
  }

   async getAllInventariosCompra() {
    return await Inventario.findAllCompra();
  }

   async getAllInventariosDonacion() {
    return await Inventario.findAllDonacion();
  }

   async getAllInventariosCaducidad() {
    return await Inventario.findAllCaducidad();
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

  async estaVencido(itemId) {
    try {
      return await Inventario.estaVencido(itemId);
    } catch (err) {
      console.error(`Error en InventarioService.estaVencido(${itemId}):`, err);
      throw err;
    }
  }
}

module.exports = new InventarioService();
