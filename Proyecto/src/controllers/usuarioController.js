const usuarioService = require('../services/usuarioService');

class UsuarioController {
  async create(req, res) {
    try {
      req.body.rol = Number(req.body.rol); // convertir a número
      const usuario = await usuarioService.createUser(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const usuarios = await usuarioService.getAllUsers();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  
  async getAllRoles(req, res) {
    try {
      const usuarios = await usuarioService.getAllRoles();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
      const usuario = await usuarioService.getUserById(id);
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async search(req, res) {
    try {
      const usuarios = await usuarioService.searchUserByNameOrLast(req.query.q || "");
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
      req.body.rol = Number(req.body.rol); // convertir a número
      const usuario = await usuarioService.updateUser(id, req.body);
      if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
      const deleted = await usuarioService.deleteUser(id);
      if (!deleted) return res.status(404).json({ error: "Usuario no encontrado" });
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const usuario = await usuarioService.authenticateUser(email, password);
      if (!usuario) return res.status(401).json({ error: "Credenciales inválidas" });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

   async getNombreCompleto(req, res) {
    try {
      const nombre = await usuarioService.getNombreCompleto(req.params.id);
      res.status(200).json({ nombre });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async emailValido(req, res) {
    try {
      const valido = await usuarioService.emailValido(req.params.email);
      res.status(200).json({ valido });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async normalizarTelefono(req, res) {
    try {
      const telefono = await usuarioService.normalizarTelefono(req.params.tel);
      res.status(200).json({ telefono });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UsuarioController();
