const Warranty = require('../models/Warranty');
const softwareService = require('./softwareService');
const excelService = require('./excelService');

/**
 * HARDWARE WARRANTY SERVICE
 * Core logic for hardware warranty management.
 */

/**
 * Calculate hardware warranty status
 */
const getHardwareStatus = (warranty) => {
  if (warranty.status === 'Pending') {
    return {
      statusLabel: 'Chờ kích hoạt',
      isActivated: false,
      remainingDays: 0,
      isExpired: false
    };
  }

  const now = new Date();
  const end = new Date(warranty.endDate);
  
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    statusLabel: diffDays > 0 ? 'Đang hoạt động' : 'Hết hạn',
    isActivated: true,
    remainingDays: diffDays > 0 ? diffDays : 0,
    isExpired: diffDays <= 0
  };
};

/**
 * Create new hardware warranty records
 */
const createWarranty = async (data) => {
  const { 
    serialNumbers, 
    serialNumber, 
    hasSoftware,
    softwareInfo,
    ...rest 
  } = data;
  
  const finalSerialNumbers = Array.isArray(serialNumbers) 
    ? serialNumbers 
    : [serialNumber].filter(Boolean);

  if (finalSerialNumbers.length === 0) {
    throw new Error('Cần ít nhất một số Serial Number');
  }

  // Check duplicates
  const existing = await Warranty.findOne({ serialNumber: { $in: finalSerialNumbers } });
  if (existing) {
    const foundSN = existing.serialNumber.find(sn => finalSerialNumbers.includes(sn));
    throw new Error(`Serial Number đã tồn tại trong hệ thống: ${foundSN}`);
  }

  // Prepare software using dedicated service
  const finalSoftwareInfo = softwareService.initializeSoftwareInfo(hasSoftware, softwareInfo, finalSerialNumbers[0]);

  const toInsert = finalSerialNumbers.map(sn => ({
    ...rest,
    serialNumber: [sn],
    status: 'Pending',
    hasSoftware: !!hasSoftware,
    softwareInfo: finalSoftwareInfo
  }));

  if (toInsert.length > 1) {
    return await Warranty.insertMany(toInsert);
  } else {
    const newWarranty = new Warranty(toInsert[0]);
    return await newWarranty.save();
  }
};

/**
 * Activate Hardware and its associated software
 */
const activateWarranty = async (id) => {
  const warranty = await Warranty.findById(id);
  if (!warranty) throw new Error('Không tìm thấy bản ghi bảo hành');
  if (warranty.status === 'Activated') throw new Error('Bảo hành đã được kích hoạt trước đó');

  const activationDate = new Date();
  
  // 1. Hardware activation
  const endDate = new Date(activationDate);
  endDate.setMonth(endDate.getMonth() + (warranty.warrantyPeriod || 24));

  warranty.status = 'Activated';
  warranty.activationDate = activationDate;
  warranty.endDate = endDate;

  // 2. Software activation delegation
  if (warranty.hasSoftware) {
    warranty.softwareInfo = softwareService.prepareSoftwareActivation(warranty, activationDate);
  }

  await warranty.save();
  
  const obj = warranty.toObject();
  return {
    ...obj,
    serialNumber: Array.isArray(obj.serialNumber) ? obj.serialNumber : [obj.serialNumber],
    ...getHardwareStatus(warranty)
  };
};

/**
 * Import data using excelService
 */
const importWarranties = async (buffer) => {
  const { toInsert, results } = await excelService.parseAndValidateExcel(buffer);
  
  if (results.errors.length > 0) return results;

  const imported = await Warranty.insertMany(toInsert);
  results.success = imported.length;
  results.imported = imported.map(w => {
    const obj = w.toObject();
    return {
      ...obj,
      serialNumber: Array.isArray(obj.serialNumber) ? obj.serialNumber : [obj.serialNumber]
    };
  });

  return results;
};

/**
 * CRUD Operations
 */
const deleteWarranty = async (id) => await Warranty.findByIdAndDelete(id);

const bulkDeleteWarranties = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) throw new Error('Danh sách ID không hợp lệ');
  return await Warranty.deleteMany({ _id: { $in: ids } });
};

const updateWarranty = async (id, data) => {
  const { serialNumbers, serialNumber, ...rest } = data;
  const updateData = { ...rest };
  
  // Find current record to check status and existing dates
  const current = await Warranty.findById(id);
  if (!current) return null;

  // Handle Serial Number updates
  if (serialNumbers || serialNumber) {
    updateData.serialNumber = Array.isArray(serialNumbers) 
      ? serialNumbers 
      : [serialNumber].filter(Boolean);
  }

  // RECALCULATE DATES if activated
  // Case A: Record is ALREADY activated, or being activated by Admin
  const status = data.status || current.status;
  const activationDate = data.activationDate ? new Date(data.activationDate) : current.activationDate;
  const warrantyPeriod = data.warrantyPeriod !== undefined ? data.warrantyPeriod : current.warrantyPeriod;

  if (status === 'Activated' && activationDate) {
    const newEndDate = new Date(activationDate);
    newEndDate.setMonth(newEndDate.getMonth() + (warrantyPeriod || 24));
    updateData.endDate = newEndDate;
    updateData.status = 'Activated';
    updateData.activationDate = activationDate;

    // Also update software dates if applicable
    const hasSW = data.hasSoftware !== undefined ? data.hasSoftware : current.hasSoftware;
    if (hasSW) {
      // Merge softwareInfo to preserve fields like masterSerial
      const swInfoUpdate = data.softwareInfo || {};
      const currentSW = current.softwareInfo ? current.softwareInfo.toObject() : {};
      
      const licenseType = swInfoUpdate.licenseType || currentSW.licenseType;
      
      if (licenseType) {
        const newSoftwareEndDate = softwareService.calculateLicenseEndDate(activationDate, licenseType);
        
        updateData.softwareInfo = {
          ...currentSW,
          ...swInfoUpdate,
          softwareEndDate: newSoftwareEndDate,
          licenseStatus: 'Activated'
        };
      }
    }
  }

  const updated = await Warranty.findByIdAndUpdate(id, updateData, { new: true });
  if (!updated) return null;
  
  const obj = updated.toObject();
  return {
    ...obj,
    serialNumber: Array.isArray(obj.serialNumber) ? obj.serialNumber : [obj.serialNumber],
    ...getHardwareStatus(updated)
  };
};

const getAllWarranties = async (filters) => {
  const { 
    customerType, serialNumber, status, companyName, customerPhone, taxCode,
    page = 1, limit = 10 
  } = filters;

  let query = {};
  if (customerType) query.customerType = customerType;
  if (serialNumber) query.serialNumber = serialNumber;
  if (status) query.status = status;
  if (companyName) query.companyName = new RegExp(companyName, 'i');
  if (customerPhone) query.customerPhone = customerPhone;
  if (taxCode) query.taxCode = taxCode;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [warranties, total] = await Promise.all([
    Warranty.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Warranty.countDocuments(query)
  ]);

  const data = warranties.map(w => {
    const obj = w.toObject();
    return {
      ...obj,
      serialNumber: Array.isArray(obj.serialNumber) ? obj.serialNumber : [obj.serialNumber],
      ...getHardwareStatus(w)
    };
  });

  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    }
  };
};

module.exports = {
  createWarranty,
  updateWarranty,
  deleteWarranty,
  bulkDeleteWarranties,
  activateWarranty,
  importWarranties,
  getAllWarranties,
  getHardwareStatus
};
