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
    serialNumber: ['SN-APPLE-2024-001'],
    customerType: 'Retail',
    warrantyPeriod: 24,
    startDate: new Date('2024-01-01'),
    status: 'Pending',
  },
  {
    companyName: 'DA Solar Project',
    taxCode: '0908070605',
    customerPhone: '02833445566',
    productCode: 'SOLAR-INV-5K',
    productName: 'Inverter Solar 5kW Hybrid',
    serialNumber: ['INV-X100', 'INV-X101', 'INV-X102', 'INV-X103'],
    customerType: 'Project',
    warrantyPeriod: 36,
    startDate: new Date('2024-03-15'),
    status: 'Pending',
  },
  {
    companyName: 'Nguyễn Văn A',
    customerPhone: '0912345678',
    productCode: 'MOUSE-MX3',
    productName: 'Logitech MX Master 3S',
    serialNumber: ['SN-LOGI-888'],
    customerType: 'Retail',
    warrantyPeriod: 12,
    startDate: new Date('2024-02-01'),
    status: 'Activated',
    activationDate: new Date('2024-02-05'),
    endDate: new Date('2025-02-05'),
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
