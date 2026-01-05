const { softwareService } = require('../services');

const createSoftware = async (req, res) => {
  try {
    const result = await softwareService.createSoftware(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllSoftware = async (req, res) => {
  try {
    const result = await softwareService.getAllSoftware(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSoftware = async (req, res) => {
  try {
    const result = await softwareService.updateSoftware(req.params.id, req.body);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSoftware = async (req, res) => {
  try {
    const result = await softwareService.deleteSoftware(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const activateSoftware = async (req, res) => {
    try {
        const result = await softwareService.activateSoftware(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const bulkDeleteSoftware = async (req, res) => {
    try {
        const { ids } = req.body;
        await softwareService.bulkDeleteSoftware(ids);
        res.json({ message: 'Bulk delete successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
  createSoftware,
  getAllSoftware,
  updateSoftware,
  deleteSoftware,
  activateSoftware,
  bulkDeleteSoftware
};
