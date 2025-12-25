const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
  },
  taxCode: {
    type: String,
    trim: true,
    index: true, // Index for searching by tax code
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
    index: true, // Index for searching by phone
  },
  productCode: {
    type: String,
    required: true,
    trim: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true, // Unique index as requested
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Warranty', warrantySchema);
