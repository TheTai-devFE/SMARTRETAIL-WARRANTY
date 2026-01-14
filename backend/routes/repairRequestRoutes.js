const express = require('express');
const router = express.Router();
const { repairService } = require('../services');

const upload = require('../middlewares/upload');

// Create Repair Request with Images
router.post('/', (req, res, next) => {
  const uploadHandler = upload.array('images', 5);

  uploadHandler(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      return res.status(400).json({
        message: 'Lỗi khi upload ảnh: ' + err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const data = req.body;

    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => {
        return file.path.startsWith('http')
          ? file.path
          : `/uploads/repairs/${file.filename}`;
      });
    }

    const result = await repairService.createRequest(data);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating repair request:', error.message);
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
