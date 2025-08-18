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

  async getAllInventariosCompra(req, res) {
    try {
      const inventarios = await inventarioService.getAllInventariosCompra();
      res.status(200).json(inventarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllInventariosDonacion(req, res) {
    try {
      const inventarios = await inventarioService.getAllInventariosDonacion();
      res.status(200).json(inventarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

    async getAllInventariosCaducidad(req, res) {
    try {
      const inventarios = await inventarioService.getAllInventariosCaducidad();
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
      res.status(201).json({ success: true, inventarios }); // <-- Aquí
    } catch (error) {
      res.status(400).json({ success: false, message: error.message }); // <-- Y aquí
    }
  }
  


 async updateInventario(req, res) {
  try {
    const inventario = await inventarioService.updateInventario(req.params.id, req.body);

    if (!inventario) {
      // No se encontró el inventario o no se modificaron los datos
      return res.status(404).json({ success: false, message: 'Inventario no encontrado o no se modificaron los datos' });
    }

    // Actualización exitosa
    res.status(200).json({ success: true, inventario });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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

   async estaVencido(req, res) {
    try {
      const vencido = await inventarioService.estaVencido(req.params.id);
      res.status(200).json({ vencido });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new InventarioController();