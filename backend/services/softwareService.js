/**
 * SOFTWARE LICENSE SERVICE
 * Handles all logic related to software accounts, license types, and activation.
 */

/**
 * Calculate the end date of a software license based on type
 * @param {Date} startDate 
 * @param {string} licenseType 
 * @returns {Date|null}
 */
const calculateLicenseEndDate = (startDate, licenseType) => {
  if (!startDate || !licenseType) return null;
  
  const endDate = new Date(startDate);
  
  switch (licenseType) {
    case '1_Year':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    case '2_Years':
      endDate.setFullYear(endDate.getFullYear() + 2);
      break;
    case '3_Years':
      endDate.setFullYear(endDate.getFullYear() + 3);
      break;
    case 'Lifetime':
      endDate.setFullYear(endDate.getFullYear() + 50); // Effectively lifetime
      break;
    default:
      return null;
  }
  
  return endDate;
};

/**
 * Calculate software status based on license status and end date
 * @param {Object} softwareInfo 
 * @returns {Object}
 */
const getSoftwareStatus = (softwareInfo) => {
  if (!softwareInfo || softwareInfo.licenseStatus === 'Pending') {
    return {
      swStatusLabel: 'Chờ kích hoạt',
      swRemainingDays: 0,
      swIsExpired: false
    };
  }

  if (softwareInfo.licenseType === 'Lifetime') {
    return {
      swStatusLabel: 'Trọn đời',
      swRemainingDays: 9999,
      swIsExpired: false
    };
  }

  if (!softwareInfo.softwareEndDate) {
    return {
      swStatusLabel: 'Đã kích hoạt',
      swRemainingDays: 0,
      swIsExpired: false
    };
  }

  const now = new Date();
  const end = new Date(softwareInfo.softwareEndDate);
  
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    swStatusLabel: diffDays > 0 ? 'Đang hoạt động' : 'Hết hạn',
    swRemainingDays: diffDays > 0 ? diffDays : 0,
    swIsExpired: diffDays <= 0
  };
};

/**
 * Masks sensitive software information for member devices.
 * Determins if the searched serial is the master of the project.
 * 
 * @param {Object} warranty 
 * @param {string} searchedSerial 
 * @returns {Object}
 */
const getMaskedSoftwareInfo = (warranty, searchedSerial) => {
  const obj = warranty.toObject ? warranty.toObject() : { ...warranty };
  
  if (!obj.hasSoftware) {
    return { ...obj, isMaster: false };
  }

  const masterSerial = obj.softwareInfo?.masterSerial || (Array.isArray(obj.serialNumber) ? obj.serialNumber[0] : obj.serialNumber);
  const isMaster = searchedSerial.toLowerCase() === masterSerial.toLowerCase();

  const swStatus = getSoftwareStatus(obj.softwareInfo);
  const result = { 
    ...obj, 
    isMaster,
    softwareStatus: swStatus
  };

  if (!isMaster) {
    // Hide sensitive software info for member devices
    if (result.softwareInfo) {
      result.softwareInfo.softwareAccount = undefined;
      result.softwareInfo.softwarePassword = undefined;
    }
  }

  return result;
};

/**
 * Initializes software info for a new hardware record.
 * 
 * @param {boolean} hasSoftware 
 * @param {Object} softwareInfo 
 * @param {string} defaultMasterSerial 
 * @returns {Object|null}
 */
const initializeSoftwareInfo = (hasSoftware, softwareInfo, defaultMasterSerial) => {
  if (!hasSoftware) return null;

  return {
    ...softwareInfo,
    masterSerial: softwareInfo?.masterSerial || defaultMasterSerial,
    licenseStatus: 'Pending'
  };
};

/**
 * Formats software info coming from Excel rows.
 * 
 * @param {Object} row 
 * @param {string} masterSerial 
 * @returns {Object|null}
 */
const formatSoftwareImport = (row, masterSerial) => {
  const hasSW = !!(row.hasSoftware || row['Bao gồm phần mềm']);
  if (!hasSW) return null;

  return {
    softwareAccount: row.softwareAccount || row['Tài khoản'],
    softwarePassword: row.softwarePassword || row['Mật khẩu'],
    playerId: row.playerId || row['Player ID'],
    licenseType: row.licenseType || row['Loại bản quyền'] || '1_Year',
    licenseStatus: 'Pending',
    masterSerial: masterSerial
  };
};

/**
 * Handle software activation logic
 * @param {Object} warranty 
 * @param {Date} activationDate 
 * @returns {Object} Updated software info
 */
const prepareSoftwareActivation = (warranty, activationDate) => {
  if (!warranty.hasSoftware || !warranty.softwareInfo) return null;

  const currentInfo = warranty.softwareInfo.toObject ? warranty.softwareInfo.toObject() : warranty.softwareInfo;

  return {
    ...currentInfo,
    licenseStatus: 'Activated',
    softwareEndDate: calculateLicenseEndDate(activationDate, currentInfo.licenseType)
  };
};

module.exports = {
  calculateLicenseEndDate,
  getSoftwareStatus,
  getMaskedSoftwareInfo,
  prepareSoftwareActivation,
  initializeSoftwareInfo,
  formatSoftwareImport
};
