const express = require('express');
const router = express.Router();
const Warranty = require('../models/Warranty');

// Helper to calculate status and remaining days
const getWarrantyStatus = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    status: diffDays > 0 ? 'Active' : 'Expired',
    remainingDays: diffDays > 0 ? diffDays : 0
  };
};

// --- ADMIN APIs ---

// Create Warranty
router.post('/warranties', async (req, res) => {
  try {
    const newWarranty = new Warranty(req.body);
    await newWarranty.save();
    res.status(201).json(newWarranty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List all warranties with search/filter
router.get('/warranties', async (req, res) => {
  try {
    const { companyName, taxCode, customerPhone, serialNumber } = req.query;
    let query = {};
    if (companyName) query.companyName = new RegExp(companyName, 'i');
    if (taxCode) query.taxCode = taxCode;
    if (customerPhone) query.customerPhone = customerPhone;
    if (serialNumber) query.serialNumber = serialNumber;

    const warranties = await Warranty.find(query).sort({ createdAt: -1 });
    res.json(warranties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Warranty
router.put('/warranties/:id', async (req, res) => {
  try {
    const updated = await Warranty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Warranty
router.delete('/warranties/:id', async (req, res) => {
  try {
    await Warranty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- CUSTOMER APIs ---

// Public Search (Serial + MST OR Serial + Phone)
router.post('/warranty/search', async (req, res) => {
  try {
    const { serialNumber, taxCode, customerPhone } = req.body;
    
    if (!serialNumber) {
      return res.status(400).json({ message: 'Serial number is required' });
    }

    let query = { serialNumber };
    if (taxCode) {
      query.taxCode = taxCode;
    } else if (customerPhone) {
      query.customerPhone = customerPhone;
    } else {
      return res.status(400).json({ message: 'Tax Code or Phone Number is required' });
    }

    const warranty = await Warranty.findOne(query);
    
    if (!warranty) {
      return res.status(404).json({ message: 'No warranty record found' });
    }

    const info = getWarrantyStatus(warranty.endDate);
    res.json({
      ...warranty.toObject(),
      status: info.status,
      remainingDays: info.remainingDays
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List by Phone
router.get('/warranty/by-phone/:phone', async (req, res) => {
  try {
    const warranties = await Warranty.find({ customerPhone: req.params.phone });
    res.json(warranties.map(w => ({
      ...w.toObject(),
      ...getWarrantyStatus(w.endDate)
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List by Tax Code
router.get('/warranty/by-tax/:taxCode', async (req, res) => {
  try {
    const warranties = await Warranty.find({ taxCode: req.params.taxCode });
    res.json(warranties.map(w => ({
      ...w.toObject(),
      ...getWarrantyStatus(w.endDate)
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
