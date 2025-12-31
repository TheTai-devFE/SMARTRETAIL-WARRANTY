const xlsx = require('xlsx');
const Warranty = require('../models/Warranty');
const softwareService = require('./softwareService');

/**
 * Parses Excel buffer and validates against duplicates in file and database.
 * Returns an array of formatted warranty objects ready for insertion.
 * 
 * @param {Buffer} buffer 
 * @returns {Promise<Object>} { toInsert: Array, results: Object }
 */
const parseAndValidateExcel = async (buffer) => {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const results = {
    success: 0,
    errors: [],
    imported: []
  };

  const allSerialsInFile = [];
  
  // 1. Validate file content and internal duplicates
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rawSN = String(row.serialNumber || row['Serial Number'] || '').trim();
    if (!rawSN) {
        results.errors.push(`Dòng ${i + 2}: Thiếu Serial Number`);
        continue;
    }

    const serialsInRow = rawSN.split(/[,\s;/]+/).map(s => s.trim()).filter(Boolean);
    
    if (serialsInRow.length === 0) {
      results.errors.push(`Dòng ${i + 2}: Serial Number không hợp lệ`);
      continue;
    }

    for (const sn of serialsInRow) {
      if (allSerialsInFile.includes(sn)) {
        results.errors.push(`Dòng ${i + 2}: Serial Number trùng lặp trong file: ${sn}`);
        continue;
      }
      allSerialsInFile.push(sn);
    }
  }

  if (results.errors.length > 0) return { toInsert: [], results };

  // 2. Check duplicates in Database
  const existingInDb = await Warranty.find({ serialNumber: { $in: allSerialsInFile } });
  if (existingInDb.length > 0) {
    const duplicateSerials = existingInDb.flatMap(w => w.serialNumber).filter(sn => allSerialsInFile.includes(sn));
    results.errors.push(`Các Serial sau đã tồn tại trong hệ thống: ${duplicateSerials.join(', ')}`);
    return { toInsert: [], results };
  }

  // 3. Format data for Insertion
  const toInsert = data.map(row => {
    const rawSN = String(row.serialNumber || row['Serial Number'] || '').trim();
    const serials = rawSN.split(/[,\s;/]+/).map(s => s.trim()).filter(Boolean);
    
    if (serials.length === 0) return null;

    const swInfo = softwareService.formatSoftwareImport(row, serials[0]);
    const hasSW = !!swInfo;

    // Split records into individual entries for maintainability
    return serials.map(sn => ({
      companyName: row.companyName || row['Công ty'],
      taxCode: row.taxCode || row['Mã số thuế'],
      deliveryAddress: row.deliveryAddress || row['Địa chỉ giao hàng'] || row['Địa chỉ'],
      customerPhone: String(row.customerPhone || row['Số điện thoại'] || ''),
      productCode: row.productCode || row['Mã sản phẩm'],
      productName: row.productName || row['Tên sản phẩm'],
      serialNumber: [sn],
      customerType: row.customerType || 'Retail',
      warrantyPeriod: parseInt(row.warrantyPeriod || row['Thời hạn bảo hành']) || 24,
      startDate: row.startDate ? new Date(row.startDate) : new Date(),
      status: 'Pending',
      hasSoftware: hasSW,
      softwareInfo: swInfo
    }));
  }).flat().filter(Boolean);

  return { toInsert, results };
};

module.exports = {
  parseAndValidateExcel
};
