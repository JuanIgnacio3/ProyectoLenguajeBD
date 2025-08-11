const reporteService = require('../services/reporteService');


class ReporteController {
  async getAllReportes(req, res) {
    try {
      const reportes = await reporteService.getAllReportes();
      res.status(200).json(reportes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getReporteById(req, res) {
    try {
      const reportes = await reporteService.getReporteById(req.params.id);
      if (reportes) {
        res.status(200).json(reportes);
      } else {
        res.status(404).json({ error: 'Reporte no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async searchReporteByTipo(req, res) {
    try {
      const reportes = await reporteService.searchReporteByTipo(req.body.search);
      res.status(200).json(reportes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createReporte(req, res) {
    try {
      const reportes = await reporteService.createReporte(req.body);
      res.status(201).json(reportes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateReporte(req, res) {
    try {
      const reportes = await reporteService.updateReporte(req.params.id, req.body);
      if (reportes) {
        res.status(200).json(reportes);
      } else {
        res.status(404).json({ error: 'Reporte no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteReporte(req, res) {
    try {
      const success = await reporteService.deleteReporte(req.params.id);
      if (success) {
        res.status(200).json({ message: 'Reporte eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'Reporte no encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ReporteController();