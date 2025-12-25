require('dotenv').config();
const mongoose = require('mongoose');
const Warranty = require('./models/Warranty');

const seedData = [
  {
    companyName: 'Công ty TNHH SmartRetail',
    taxCode: '0102030405',
    customerPhone: '0987654321',
    productCode: 'LAPTOP-001',
    productName: 'MacBook Pro M2 14 inch',
    serialNumber: 'SN-APPLE-2024-001',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-01-01'),
  },
  {
    companyName: 'Công ty TNHH SmartRetail',
    taxCode: '0102030405',
    customerPhone: '0987654321',
    productCode: 'IPHONE-15',
    productName: 'iPhone 15 Pro Max 256GB',
    serialNumber: 'SN-IPHONE-15-XYZ',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-12-01'),
  },
  {
    companyName: '',
    taxCode: '',
    customerPhone: '0912345678',
    productCode: 'MOUSE-MX3',
    productName: 'Logitech MX Master 3S',
    serialNumber: 'SN-LOGI-888',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'), // Expired
  },
  {
    companyName: 'Nguyễn Văn A',
    taxCode: '',
    customerPhone: '0901234567',
    productCode: 'KEYBOARD-K3',
    productName: 'Keychron K3 Pro Wireless',
    serialNumber: 'SN-K3P-002',
    startDate: new Date('2024-06-15'),
    endDate: new Date('2025-06-15'), // Active
  }
];

const seedDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/warranty_system';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    await Warranty.deleteMany({});
    console.log('Cleared existing data.');
    
    await Warranty.insertMany(seedData);
    console.log('Added seed data successfully!');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
