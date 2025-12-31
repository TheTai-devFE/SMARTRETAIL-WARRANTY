const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
  },
  taxCode: {
    type: String,
    trim: true,
    index: true,
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
    type: [String], // Supports single or multiple (for Projects)
    required: true,
    index: true, // Index for searching within the array
  },
  customerType: {
    type: String,
    enum: ['Project', 'Dealer', 'Retail'],
    default: 'Retail',
  },
  warrantyPeriod: {
    type: Number, // 18, 24, 32... months
    default: 24,
  },
  status: {
    type: String,
    enum: ['Pending', 'Activated'],
    default: 'Pending',
  },
  hasSoftware: {
    type: Boolean,
    default: false,
  },
  softwareInfo: {
    softwareAccount: { type: String, trim: true },
    softwarePassword: { type: String, trim: true },
    playerId: { type: String, trim: true },
    licenseType: {
      type: String,
      enum: ['1_Year', '2_Years', '3_Years', 'Lifetime'],
    },
    licenseStatus: {
      type: String,
      enum: ['Pending', 'Activated', 'Expired'],
      default: 'Pending'
    },
    masterSerial: { type: String, trim: true },
    softwareEndDate: { type: Date },
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
});

// Index for uniqe serial numbers is handled in the field definition above
// warrantySchema.index({ serialNumber: 1 });

// Rename model to WarrantyV2 to ensure MongoDB Atlas picks up the new schema structure without old validators
module.exports = mongoose.model('WarrantyV2', warrantySchema, 'warranties_v2');
