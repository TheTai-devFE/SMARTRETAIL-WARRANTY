const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Customer Information (The "One" side of the relationship)
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
    index: true,
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  deliveryAddress: {
    type: String,
    trim: true,
  },
  
  // Common Product Information ("Specs" for the whole batch)
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
  
  // Project Specifics
  customerType: {
    type: String,
    enum: ['Project', 'Dealer', 'Retail'],
    default: 'Project',
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  
  // Optional: Link to a "Master" Serial Number if needed for quick reference
  masterSerialNumber: {
    type: String,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema, 'projects');
