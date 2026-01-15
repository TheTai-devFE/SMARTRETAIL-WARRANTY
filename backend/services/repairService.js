const RepairRequest = require('../models/RepairRequest');

const { sendRepairConfirmation } = require('./emailService');

const createRequest = async (data) => {
  // Generate simple code: SR + random 6 digits
  const code = 'SR-' + Math.floor(100000 + Math.random() * 900000);
  const request = new RepairRequest({ ...data, code });
  const savedRequest = await request.save();

  console.log('📝 Repair request created:', savedRequest.code);
  console.log('📧 Customer email:', savedRequest.email);

  // Send confirmation email asynchronously
  if (savedRequest.email) {
    console.log('✅ Email found, attempting to send...');
    sendRepairConfirmation(savedRequest).catch(err => {
      console.error('❌ Email sending failed:', err.message);
    });
  } else {
    console.log('⚠️  No email provided, skipping email send');
  }

  return savedRequest;
};

const getAllRequests = async () => {
  return await RepairRequest.find().sort({ createdAt: -1 });
};

const searchRequests = async ({ code, phoneNumber }) => {
  const query = {};
  if (code) query.code = code.trim().toUpperCase();
  if (phoneNumber) query.phoneNumber = phoneNumber.trim();

  // Require at least one to prevent dump
  if (Object.keys(query).length === 0) return [];

  return await RepairRequest.find(query);
};

const updateStatus = async (id, status, warrantyDuration) => {
  const updateData = { status };

  // If provided, update duration
  if (warrantyDuration !== undefined) {
    updateData.warrantyDuration = parseInt(warrantyDuration);
  }

  // If status is completed, calculate end date based on duration
  if (status === 'completed') {
    const request = await RepairRequest.findById(id);
    const duration = warrantyDuration !== undefined ? parseInt(warrantyDuration) : request.warrantyDuration;

    if (duration > 0) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + duration);
      updateData.warrantyEndDate = endDate;
    }
  }

  return await RepairRequest.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteRequest = async (id) => {
  return await RepairRequest.findByIdAndDelete(id);
};

module.exports = {
  createRequest,
  getAllRequests,
  searchRequests,
  updateStatus,
  deleteRequest
};
