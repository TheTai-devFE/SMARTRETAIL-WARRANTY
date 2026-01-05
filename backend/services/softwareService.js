const Software = require('../models/Software');

/**
 * SOFTWARE SERVICE
 * Handles DB operations for Software model + Business Logic
 */

// --- Business Logic (Moved from old file or kept) ---

/**
 * Calculate the end date of a software license based on type
 */
const calculateLicenseEndDateLogic = (startDate, licenseType) => {
  if (!startDate || !licenseType) return null;
  const endDate = new Date(startDate);
  switch (licenseType) {
    case '1_Year': endDate.setFullYear(endDate.getFullYear() + 1); break;
    case '2_Years': endDate.setFullYear(endDate.getFullYear() + 2); break;
    case '3_Years': endDate.setFullYear(endDate.getFullYear() + 3); break;
    case 'Lifetime': endDate.setFullYear(endDate.getFullYear() + 50); break;
    default: return null;
  }
  return endDate;
};

/**
 * Calculate refined software status
 */
const getSoftwareStatus = (software) => {
  // Priority 1: Check license status first
  if (software.licenseStatus === 'Pending') {
    return { statusLabel: 'Chờ kích hoạt', remainingDays: 0, isExpired: false };
  }
  
  if (software.licenseStatus === 'Expired') {
    return { statusLabel: 'Hết hạn', remainingDays: 0, isExpired: true };
  }
  
  // Priority 2: If Activated, check license type
  if (software.licenseStatus === 'Activated') {
    if (software.licenseType === 'Lifetime') {
      return { statusLabel: 'Trọn đời', remainingDays: 9999, isExpired: false };
    }
    
    // For time-limited licenses, check endDate
    if (!software.endDate) {
      return { statusLabel: 'Đã kích hoạt', remainingDays: 0, isExpired: false };
    }
    
    const now = new Date();
    const end = new Date(software.endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      statusLabel: diffDays > 0 ? 'Đang hoạt động' : 'Hết hạn',
      remainingDays: diffDays > 0 ? diffDays : 0,
      isExpired: diffDays <= 0
    };
  }
  
  // Fallback
  return { statusLabel: 'Không xác định', remainingDays: 0, isExpired: false };
};

// --- DB Operations ---

const { generateCustomerCode } = require('./codeGenerator');

const createSoftware = async (data) => {
  if (!data.customerCode) {
    data.customerCode = generateCustomerCode();
  }

  const deviceLimit = parseInt(data.deviceLimit) || 1;
  
  // Create single software record with deviceLimit = input value
  const software = new Software({
    ...data,
    deviceLimit: deviceLimit
  });
  
  return await software.save();
};

const getAllSoftware = async (filters) => {
  const { 
    customerCode, taxCode, productName, licenseStatus, 
    page = 1, limit = 10 
  } = filters;

  let query = {};
  if (customerCode) query.customerCode = { $regex: customerCode, $options: 'i' };
  if (taxCode) query.taxCode = { $regex: taxCode, $options: 'i' };
  if (productName) query.productName = { $regex: productName, $options: 'i' };
  if (licenseStatus) query.licenseStatus = licenseStatus;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [softwareList, total] = await Promise.all([
    Software.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Software.countDocuments(query)
  ]);

  const data = softwareList.map(sw => {
    const obj = sw.toObject();
    return {
      ...obj,
      ...getSoftwareStatus(obj)
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

const updateSoftware = async (id, data) => {
  return await Software.findByIdAndUpdate(id, data, { new: true });
};

const deleteSoftware = async (id) => {
  return await Software.findByIdAndDelete(id);
};

const bulkDeleteSoftware = async (ids) => {
  return await Software.deleteMany({ _id: { $in: ids } });
};

const activateSoftware = async (id) => {
    const sw = await Software.findById(id);
    if (!sw) throw new Error('Not found');
    if (sw.licenseStatus === 'Activated') throw new Error('Already activated');

    const now = new Date();
    sw.licenseStatus = 'Activated';
    sw.activationDate = now;
    sw.startDate = now; // Assuming start on activation
    sw.endDate = calculateLicenseEndDateLogic(now, sw.licenseType);
    
    return await sw.save();
};

const formatSoftwareImport = (row, relatedSerial) => {
    // Check if row has software columns (e.g. softwareAccount)
    const account = row.softwareAccount || row['Tài khoản software'];
    const password = row.softwarePassword || row['Mật khẩu software'];
    
    if (!account && !password) return null;

    return {
        softwareAccount: account,
        softwarePassword: password,
        playerId: row.playerId || row['Player ID'],
        licenseType: row.licenseType || row['Loại license'] || '1_Year',
        productName: row.softwareName || row['Tên phần mềm'] || 'Kèm Phần Cứng',
        relatedHardwareSerial: relatedSerial
    };
};

module.exports = {
  calculateLicenseEndDate: calculateLicenseEndDateLogic,
  getSoftwareStatus,
  createSoftware,
  getAllSoftware,
  updateSoftware,
  deleteSoftware,
  bulkDeleteSoftware,
  activateSoftware,
  formatSoftwareImport
};
