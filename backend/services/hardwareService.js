const Hardware = require('../models/Hardware');
const Software = require('../models/Software');
const Project = require('../models/Project');
const softwareService = require('./softwareService');
const excelService = require('./excelService');
const { generateCustomerCode } = require('./codeGenerator');

/**
 * HARDWARE SERVICE
 * Managed Hardware model + Orchestration
 */

const getHardwareStatus = (hardware) => {
  if (hardware.status === 'Pending') {
    return {
      statusLabel: 'Chờ kích hoạt',
      isActivated: false,
      remainingDays: 0,
      isExpired: false
    };
  }

  const now = new Date();
  const end = new Date(hardware.endDate);

  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    statusLabel: diffDays > 0 ? 'Đang hoạt động' : 'Hết hạn',
    isActivated: true,
    remainingDays: diffDays > 0 ? diffDays : 0,
    isExpired: diffDays <= 0
  };
};

const createWarranty = async (data) => {
  const {
    serialNumbers,
    serialNumber,
    customerCode, // Might be passed or generated
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

  // Check duplicates in Hardware
  const existing = await Hardware.findOne({ serialNumber: { $in: finalSerialNumbers } });
  if (existing) {
    const foundSN = existing.serialNumber.find(sn => finalSerialNumbers.includes(sn));
    throw new Error(`Serial Number đã tồn tại trong hệ thống: ${foundSN}`);
  }

  // Deduplication Logic: Try to reuse existing Customer Code
  // REQUIRES ALL 3 CRITERIA TO MATCH: customerPhone + taxCode + companyName
  let finalCustomerCode = customerCode;

  if (!finalCustomerCode && rest.customerPhone && rest.taxCode && rest.companyName) {
    // Check Hardware History - require all 3 fields to match
    const existByAll = await Hardware.findOne({
      customerPhone: rest.customerPhone,
      taxCode: rest.taxCode,
      companyName: rest.companyName
    }).sort({ createdAt: -1 });

    if (existByAll && existByAll.customerCode) {
      finalCustomerCode = existByAll.customerCode;
    } else {
      // Check Project History - require all 3 fields to match
      const existProject = await Project.findOne({
        customerPhone: rest.customerPhone,
        taxCode: rest.taxCode,
        companyName: rest.companyName
      }).sort({ createdAt: -1 });

      if (existProject && existProject.customerCode) {
        finalCustomerCode = existProject.customerCode;
      }
    }
  }

  // Fallback: Generate New Code if truly new customer (no match on all 3 criteria)
  if (!finalCustomerCode) {
    finalCustomerCode = generateCustomerCode();
    console.log(`Creating New Customer Identity: ${finalCustomerCode}`);
  } else {
    console.log(`Reusing Existing Customer Identity: ${finalCustomerCode}`);
  }

  // Create Project Record if necessary
  let projectId = null;
  if (rest.customerType === 'Project') {
    const newProject = await Project.create({
      customerCode: finalCustomerCode,
      companyName: rest.companyName,
      taxCode: rest.taxCode,
      customerPhone: rest.customerPhone,
      productCode: rest.productCode,
      productName: rest.productName,
      customerType: 'Project',
      totalQuantity: finalSerialNumbers.length,
      masterSerialNumber: finalSerialNumbers[0]
    });
    projectId = newProject._id;
  }

  // Handle Date Logic for Manual/Upload Creation
  let finalStatus = rest.status || 'Pending';
  let finalActivationDate = rest.activationDate ? new Date(rest.activationDate) : null;
  let finalEndDate = rest.endDate ? new Date(rest.endDate) : null;
  let period = parseInt(rest.warrantyPeriod) || 24;

  if (finalActivationDate && !finalEndDate) {
    if (!finalActivationDate) finalActivationDate = new Date();
    finalEndDate = new Date(finalActivationDate);
    finalEndDate.setMonth(finalEndDate.getMonth() + period);
    finalStatus = 'Activated'; // Ensure status matches date
  }

  // Create Hardware Records
  const toInsert = finalSerialNumbers.map(sn => ({
    ...rest,
    customerCode: finalCustomerCode,
    serialNumber: [sn],
    status: finalStatus,
    activationDate: finalActivationDate,
    endDate: finalEndDate,
    projectId: projectId, // Link to Project
    deliveryAddress: rest.deliveryAddress // Specific address
  }));

  let savedHardware;
  if (toInsert.length > 1) {
    savedHardware = await Hardware.insertMany(toInsert);
  } else {
    const newHardware = new Hardware(toInsert[0]);
    savedHardware = await newHardware.save();
  }

  // Handle Software split
  if (hasSoftware && softwareInfo) {
    if (rest.customerType === 'Project') {
      // Project: Create ONLY ONE software record (Volume License) attached to Master Serial
      const masterSerial = finalSerialNumbers[0];
      const volumeSoftware = {
        customerCode: finalCustomerCode,
        companyName: rest.companyName,
        taxCode: rest.taxCode,
        customerPhone: rest.customerPhone,
        productName: softwareInfo.productName || 'Kèm Phần Cứng (Dự Án)',
        softwareAccount: softwareInfo.softwareAccount,
        softwarePassword: softwareInfo.softwarePassword,
        playerId: softwareInfo.playerId,
        licenseType: softwareInfo.licenseType || '1_Year',
        relatedHardwareSerial: masterSerial,
        licenseStatus: 'Pending',
        deviceLimit: finalSerialNumbers.length
      };
      await Software.create(volumeSoftware);
    } else {
      const softwareDocs = finalSerialNumbers.map(sn => ({
        customerCode: finalCustomerCode,
        companyName: rest.companyName,
        taxCode: rest.taxCode,
        customerPhone: rest.customerPhone,
        productName: softwareInfo.productName || 'Kèm Phần Cứng',
        softwareAccount: softwareInfo.softwareAccount,
        softwarePassword: softwareInfo.softwarePassword,
        playerId: softwareInfo.playerId,
        licenseType: softwareInfo.licenseType || '1_Year',
        relatedHardwareSerial: sn,
        licenseStatus: 'Pending',
        deviceLimit: 1
      }));
      await Software.insertMany(softwareDocs);
    }
  }

  return savedHardware;
};

const activateWarranty = async (id) => {
  let hardware;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  if (isObjectId) {
    hardware = await Hardware.findById(id);
  }

  if (!hardware) {
    hardware = await Hardware.findOne({ serialNumber: id });
  }

  if (!hardware) throw new Error('Không tìm thấy bản ghi bảo hành');
  if (hardware.status === 'Activated') throw new Error('Bảo hành đã được kích hoạt trước đó');

  const activationDate = new Date();
  const endDate = new Date(activationDate);
  endDate.setMonth(endDate.getMonth() + (hardware.warrantyPeriod || 24));

  // Common Logic: Activate THIS Hardware Record
  hardware.status = 'Activated';
  hardware.activationDate = activationDate;
  hardware.endDate = endDate;
  await hardware.save();

  // Logic for Software Activation (Unified)
  // Check if there is a software record directly linked to this hardware serial
  // This covers:
  // 1. Retail (1-to-1): Found -> Activated
  // 2. Project Master (Linked): Found -> Activated
  // 3. Project Child (Not Linked): Not Found -> No Action
  if (hardware.serialNumber && hardware.serialNumber.length > 0) {
    const serial = hardware.serialNumber[0];
    const software = await Software.findOne({ relatedHardwareSerial: serial, customerCode: hardware.customerCode });

    if (software && software.licenseStatus !== 'Activated') {
      software.licenseStatus = 'Activated';
      software.activationDate = activationDate;
      software.startDate = activationDate;
      software.endDate = softwareService.calculateLicenseEndDate(activationDate, software.licenseType);
      await software.save();
    }
  }

  const obj = hardware.toObject();
  return {
    ...obj,
    ...getHardwareStatus(hardware)
  };
};

const importWarranties = async (buffer) => {
  // Need to update excelService to return format suitable for split
  // For now, I'll rely on excelService returning a structure I can adapt.
  // Reuse excelService logic but map to new Models.
  // This part is complex because excelService likely coupled to Warranty schema.
  // I'll leave importWarranties as a TO-DO or minimal fix.
  // Assuming excelService returns array of objects close to WarrantyV2.

  const { toInsert: rawInsert, results } = await excelService.parseAndValidateExcel(buffer);
  if (results.errors.length > 0) return results;

  let successCount = 0;
  const errors = [];

  // Process one by one to split
  for (const item of rawInsert) {
    try {
      await createWarranty(item);
      successCount++;
    } catch (err) {
      errors.push({ error: err.message, row: item });
    }
  }

  results.success = successCount;
  // results.imported ... ?
  // results.errors.push(...errors);

  return results;
};

const updateWarranty = async (id, data) => {
  const {
    serialNumbers,
    serialNumber,
    hasSoftware,
    softwareInfo,
    ...rest
  } = data;

  // Process serialNumber update - convert to array format as expected by Hardware model
  const finalSerialNumbers = Array.isArray(serialNumbers)
    ? serialNumbers
    : (serialNumber ? [serialNumber].filter(Boolean) : null);

  // If serialNumber is provided, add it to the update object
  if (finalSerialNumbers && finalSerialNumbers.length > 0) {
    // Check for duplicates (exclude current record)
    const existing = await Hardware.findOne({
      _id: { $ne: id },
      serialNumber: { $in: finalSerialNumbers }
    });
    if (existing) {
      const foundSN = existing.serialNumber.find(sn => finalSerialNumbers.includes(sn));
      throw new Error(`Serial Number đã tồn tại trong hệ thống: ${foundSN}`);
    }
    rest.serialNumber = finalSerialNumbers;
  }

  // Auto-calculate EndDate if Updating Activation
  if (rest.activationDate && !rest.endDate) {
    // We try to use provided period, or default to 24 if missing. 
    // For accurate update without period in payload, we'd need to fetch DB, 
    // but assuming Edit Form sends all fields or default is acceptable.
    const period = parseInt(rest.warrantyPeriod) || 24;
    const actDate = new Date(rest.activationDate);
    const end = new Date(actDate);
    end.setMonth(end.getMonth() + period);
    rest.endDate = end;
    rest.status = 'Activated';
  }

  // Update Hardware
  const updated = await Hardware.findByIdAndUpdate(id, rest, { new: true });
  if (!updated) throw new Error('Không tìm thấy bản ghi');

  // Handle Software Update/Create/Delete
  // Default: Link to itself (Retail/Dealer)
  let targetSerial = Array.isArray(updated.serialNumber) ? updated.serialNumber[0] : updated.serialNumber;

  // PROJECT LOGIC: Redirect to Master Serial via Project Model to avoid duplicates
  if (updated.customerType === 'Project' && updated.projectId) {
    const project = await Project.findById(updated.projectId);
    if (project && project.masterSerialNumber) {
      targetSerial = project.masterSerialNumber;
    }
  }

  if (hasSoftware && softwareInfo) {
    // Check if software already exists for this TARGET serial
    const existingSoftware = await Software.findOne({
      relatedHardwareSerial: targetSerial,
      customerCode: updated.customerCode
    });

    if (existingSoftware) {
      // Update existing software (Shared Volume License)
      await Software.findByIdAndUpdate(existingSoftware._id, {
        productName: softwareInfo.productName || existingSoftware.productName,
        softwareAccount: softwareInfo.softwareAccount,
        softwarePassword: softwareInfo.softwarePassword,
        playerId: softwareInfo.playerId,
        licenseType: softwareInfo.licenseType || '1_Year',
        companyName: updated.companyName,
        taxCode: updated.taxCode,
        customerPhone: updated.customerPhone,
      });
    } else {
      // Create new software (Only if not even Master exists)
      await Software.create({
        customerCode: updated.customerCode,
        companyName: updated.companyName,
        taxCode: updated.taxCode,
        customerPhone: updated.customerPhone,
        productName: softwareInfo.productName || 'Kèm Phần Cứng',
        softwareAccount: softwareInfo.softwareAccount,
        softwarePassword: softwareInfo.softwarePassword,
        playerId: softwareInfo.playerId,
        licenseType: softwareInfo.licenseType || '1_Year',
        relatedHardwareSerial: targetSerial, // Use Master Serial
        licenseStatus: 'Pending',
        deviceLimit: 1
      });
    }
  } else if (!hasSoftware) {
    // If hasSoftware is false, delete existing software
    await Software.deleteMany({
      relatedHardwareSerial: targetSerial,
      customerCode: updated.customerCode
    });
  }

  return updated;
};

const deleteWarranty = async (id) => await Hardware.findByIdAndDelete(id);

const bulkDeleteWarranties = async (ids) => {
  return await Hardware.deleteMany({ _id: { $in: ids } });
};

const getAllWarranties = async (filters) => {
  const {
    customerType, serialNumber, status, companyName, customerPhone, taxCode, customerCode,
    page = 1, limit = 10
  } = filters;

  let query = {};
  if (customerType) query.customerType = customerType;
  if (serialNumber) query.serialNumber = { $regex: serialNumber, $options: 'i' };
  if (status) query.status = status;
  if (companyName) query.companyName = { $regex: companyName, $options: 'i' };
  if (customerPhone) query.customerPhone = { $regex: customerPhone, $options: 'i' };
  if (taxCode) query.taxCode = { $regex: taxCode, $options: 'i' };
  if (customerCode) query.customerCode = { $regex: customerCode, $options: 'i' };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [warranties, total] = await Promise.all([
    Hardware.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Hardware.countDocuments(query)
  ]);

  const data = warranties.map(w => ({
    ...w.toObject(),
    ...getHardwareStatus(w)
  }));

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
