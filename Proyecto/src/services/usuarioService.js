const Usuario = require('../models/usuario');
const { getConnection, closeConnection } = require('../config/db');

class UsuarioService {
  async getAllUsers() {
    return await Usuario.findAll();
  }

  async getAllRoles() {
    return await Usuario.findAllRoles();
  }

  async getUserById(id) {
    const userId = Number(id);
    if (isNaN(userId)) throw new Error("ID inválido");
    return await Usuario.findById(userId);
  }

  async getUserByEmail(email) {
    return await Usuario.findByEmail(email);
  }

  async searchUserByNameOrLast(name) {
    return await Usuario.searchByNameOrLast(name);
  }

  async createUser(data) {
    if (data.rol !== undefined) data.rol = Number(data.rol);
    if (isNaN(data.rol)) throw new Error("Rol inválido");
    return await Usuario.create(data);
  }

  async updateUser(id, user) {
    const userId = Number(id);
    if (isNaN(userId)) throw new Error("ID inválido");
    if (user.rol !== undefined) user.rol = Number(user.rol);
    if (isNaN(user.rol)) throw new Error("Rol inválido");
    return await Usuario.update(userId, user);
  }

  async deleteUser(id) {
    const userId = Number(id);
    if (isNaN(userId)) throw new Error("ID inválido");
    return await Usuario.delete(userId);
  }

  async authenticateUser(email, password) {
    return await Usuario.authenticate(email, password);
  }

  async getNombreCompleto(id) {
    try {
      return await Usuario.getNombreCompleto(id);
    } catch (err) {
      console.error(`Error en UsuarioService.getNombreCompleto(${id}):`, err);
      throw err;
    }
  }

  async emailValido(email) {
    try {
      return await Usuario.emailValido(email);
    } catch (err) {
      console.error(`Error en UsuarioService.emailValido(${email}):`, err);
      throw err;
    }
  }

  async normalizarTelefono(tel) {
    try {
      return await Usuario.normalizarTelefono(tel);
    } catch (err) {
      console.error(`Error en UsuarioService.normalizarTelefono(${tel}):`, err);
      throw err;
    }
  }
}

module.exports = new UsuarioService();
