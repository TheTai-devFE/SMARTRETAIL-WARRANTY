const express = require('express');
const router = express.Router();
const multer = require('multer');
const { hardwareService } = require('../services');

const warrantyController = require('../controllers/warrantyController');

const upload = multer({ storage: multer.memoryStorage() });

// --- ADMIN APIs ---

// Create Warranty
// Create Warranty (Support Batch for Retail)
router.post('/warranties', async (req, res) => {
  try {
    const { batch, customerData, products, ...singleData } = req.body;

    if (batch && Array.isArray(products) && products.length > 0) {
      const results = [];
      // Sequential execution to ensure customer duplication logic works perfectly
      // The first one will create/find the customer, subsequent ones will reuse it.
      for (const prod of products) {
        const payload = { ...customerData, ...prod };
        // Ensure defaults
        if (!payload.customerType) payload.customerType = customerData.customerType || 'Retail';

        // Call service
        const result = await hardwareService.createWarranty(payload);
        results.push(result);
      }
      return res.status(201).json({ message: 'Đã tạo xong danh sách bảo hành', count: results.length, data: results });
    }

    const newWarranty = await hardwareService.createWarranty(req.body);
    res.status(201).json(newWarranty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List all warranties
router.get('/warranties', async (req, res) => {
  try {
    const warranties = await hardwareService.getAllWarranties(req.query);
    res.json(warranties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Import Excel
router.post('/warranties/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const results = await hardwareService.importWarranties(req.file.buffer);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Warranty
router.put('/warranties/:id', async (req, res) => {
  try {
    const updated = await hardwareService.updateWarranty(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Warranty
router.delete('/warranties/:id', async (req, res) => {
  try {
    await hardwareService.deleteWarranty(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk Delete Warranties
router.post('/warranties/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await hardwareService.bulkDeleteWarranties(ids);
    res.json({ message: 'Bulk delete successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- ACTIVATION API ---

// Activate Warranty
router.post('/warranties/:id/activate', async (req, res) => {
  try {
    const activated = await hardwareService.activateWarranty(req.params.id);
    res.json(activated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- CUSTOMER APIs ---

// Public Search
router.post('/warranty/search', warrantyController.searchWarranty);

// Get Warranty by ID (for activation page check)
router.get('/warranty/check/:id', warrantyController.getWarrantyById);

module.exports = router;
