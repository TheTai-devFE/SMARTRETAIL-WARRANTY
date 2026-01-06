const express = require('express');
const router = express.Router();
const { repairService } = require('../services');

// Create Repair Request
router.post('/', async (req, res) => {
  try {
    const result = await repairService.createRequest(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Search Requests (Public)
router.post('/search', async (req, res) => {
  try {
    const results = await repairService.searchRequests(req.body);
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu' });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List all requests (Admin)
router.get('/', async (req, res) => {
  try {
    const results = await repairService.getAllRequests();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Status
router.put('/:id', async (req, res) => {
  try {
    const { status, warrantyDuration } = req.body;
    const result = await repairService.updateStatus(req.params.id, status, warrantyDuration);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Request
router.delete('/:id', async (req, res) => {
  try {
    await repairService.deleteRequest(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
