const RepairRequest = require('../models/RepairRequest');

const createRequest = async (data) => {
  // Generate simple code: SR + random 6 digits
  // Ideally use a counter, but for simplicity:
  const code = 'SR-' + Math.floor(100000 + Math.random() * 900000);
  const request = new RepairRequest({ ...data, code });
  return await request.save();
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
