const mongoose = require('mongoose');

const RepairRequestSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Mã KH/Mã Phiếu
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  companyName: { type: String }, // Tên công ty (Optional)
  productName: { type: String, required: true },
  serialNumber: { type: String },
  images: [{ type: String }], // Mảng chứa URL ảnh từ Cloudinary
  issueDescription: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'received', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  warrantyDuration: { type: Number, default: 0 }, // In months
  warrantyEndDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RepairRequest', RepairRequestSchema);
