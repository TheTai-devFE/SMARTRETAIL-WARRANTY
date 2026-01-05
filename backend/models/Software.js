const mongoose = require('mongoose');

const softwareSchema = new mongoose.Schema({
  customerCode: {
    type: String,
    required: true, // Must belong to a customer
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
    trim: true,
  },
  productName: {
    type: String,
    required: true, // e.g., "SmartRetail CMS"
    trim: true,
  },
  softwareAccount: {
    type: String,
    trim: true,
  },
  softwarePassword: {
    type: String,
    trim: true,
  },
  playerId: {
    type: String,
    trim: true,
  },
  licenseType: {
    type: String,
    enum: ['1_Year', '2_Years', '3_Years', 'Lifetime'],
    required: true,
  },
  licenseStatus: {
    type: String,
    enum: ['Pending', 'Activated', 'Expired'],
    default: 'Pending',
  },
  startDate: {
    type: Date,
  },
  activationDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  deviceLimit: {
    type: Number,
    default: 1
  },
  // If linked to hardware
  relatedHardwareSerial: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Software', softwareSchema, 'softwares');
