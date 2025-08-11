const inventarioService = require('../services/inventarioService');


class InventarioController {
  async getAllInventarios(req, res) {
    try {
      const inventarios = await inventarioService.getAllInventarios();
      res.status(200).json(inventarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getInventarioById(req, res) {
    try {
      const inventarios = await inventarioService.getInventarioById(req.params.id);
      if (inventarios) {
        res.status(200).json(inventarios);
      } else {
        res.status(404).json({ error: 'Inventario no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async searchInventarioByTipo(req, res) {
    try {
      const inventarios = await inventarioService.searchInventarioByTipo(req.body.search);
      res.status(200).json(inventarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createInventario(req, res) {
    try {
      const inventarios = await inventarioService.createInventario(req.body);
      res.status(201).json(inventarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateInventario(req, res) {
    try {
      const inventarios = await inventarioService.updateInventario(req.params.id, req.body);
      if (inventarios) {
        res.status(200).json(inventarios);
      } else {
        res.status(404).json({ error: 'Inventario no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteInventario(req, res) {
    try {
      const success = await inventarioService.deleteInventario(req.params.id);
      if (success) {
        res.status(200).json({ message: 'Inventario eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Inventario no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new InventarioController();