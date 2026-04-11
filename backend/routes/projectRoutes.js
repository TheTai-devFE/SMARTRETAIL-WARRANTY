const express = require('express');
const router = express.Router();
const { hardwareService } = require('../services');

// List All Projects (Optimized for Dashboard)
router.get('/', async (req, res) => {
  try {
    const results = await hardwareService.getAllProjects(req.query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Devices belonging to a project (Loaded on-demand for Modal)
router.get('/:id/devices', async (req, res) => {
  try {
    const devices = await hardwareService.getDevicesByProject(req.params.id);
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Project and all its devices
router.delete('/:id', async (req, res) => {
  try {
    const result = await hardwareService.deleteProject(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
