const mongoose = require('mongoose');

const hardwareSchema = new mongoose.Schema({
  customerCode: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  taxCode: {
    type: String,
    trim: true,
    index: true, // For search
  },
  deliveryAddress: {
    type: String,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
    index: true,
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
    type: [String], // Array of SNs
    required: true,
    index: true,
  },
  customerType: {
    type: String,
    enum: ['Project', 'Dealer', 'Retail'],
    default: 'Retail',
  },
  warrantyPeriod: {
    type: Number, // months
    default: 24,
  },
  status: {
    type: String,
    enum: ['Pending', 'Activated'],
    default: 'Pending',
  },
  startDate: {
    type: Date,
    required: true,
  },
  activationDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Parent-Child Link
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null,
  },
  // Specific delivery address for this unit (can be different from Project default or updated individually)
  deliveryAddress: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Hardware', hardwareSchema, 'hardwares');
