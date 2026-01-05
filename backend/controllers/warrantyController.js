const Hardware = require('../models/Hardware');
const Project = require('../models/Project'); // Import Project Model
const Software = require('../models/Software');
const { hardwareService } = require('../services');

/**
 * Public Search API (Legacy by Serial) - Optional
 */
const searchWarranty = async (req, res) => {
  try {
    const { serialNumber } = req.body;
    if (!serialNumber) {
      return res.status(400).json({ message: 'Serial number is required' });
    }
    const trimmedSN = serialNumber.trim();
    const hardware = await Hardware.findOne({ serialNumber: trimmedSN });
    
    if (!hardware) {
      return res.status(404).json({ message: 'No hardware record found' });
    }

    // --- LOGIC CENTRALIZED ---
    const statusInfo = hardwareService.getHardwareStatus(hardware);
    const responseData = {
      ...hardware.toObject(),
      ...statusInfo
    };

    let project = null;
    let software = null;
    
    // 1. Resolve Project (New Data)
    if (hardware.projectId) {
         project = await Project.findById(hardware.projectId);
    }

    // 2. Populate Hardware Info (Project > Hardware)
    if (project) {
        responseData.customerCode = project.customerCode;
        responseData.companyName = project.companyName;
        responseData.taxCode = project.taxCode;
        responseData.customerPhone = project.customerPhone;
        responseData.projectTotal = project.totalQuantity;
        if (project.masterSerialNumber) responseData.masterSerial = project.masterSerialNumber;
    }

    // 3. Resolve Software (Robust Fallback)
    // Strategy A: Direct Link (Retail or Master)
    software = await Software.findOne({ relatedHardwareSerial: trimmedSN });
    
    // Strategy B: Project Master (New Data)
    if (!software && project && project.masterSerialNumber) {
        software = await Software.findOne({ relatedHardwareSerial: project.masterSerialNumber });
    }
    
    // Strategy C: Customer Code Fallback (Legacy Data / Retail with unlinked Software)
    // Only if still not found, and we have a customer code.
    if (!software && hardware.customerCode) {
        // Try to find ANY software for this customer.
        // If Customer Type is Project, we assume the first found software is the Volume License.
        software = await Software.findOne({ customerCode: hardware.customerCode });
        
        // Auto-fix Hardware Info from Software if missing (Legacy Data Fix)
        if (software) {
            if (!responseData.companyName || responseData.companyName === '-') responseData.companyName = software.companyName;
            if (!responseData.taxCode) responseData.taxCode = software.taxCode;
        }
    }

    // 4. Force Display Logic
    if (software) {
        const { getSoftwareStatus } = require('../services/softwareService');
        const softwareStatus = getSoftwareStatus(software);
        
        // FORCE TRUE for Project/Group items to ensure they see the info
        // UPDATED: Only isMaster if strictly matches. Admin needs hasSoftware=true to show form. 
        // Public/Activation will use isMaster to decide whether to hide/show.
        responseData.isMaster = (software.relatedHardwareSerial === (hardware.serialNumber ? hardware.serialNumber[0] : trimmedSN));
        responseData.hasSoftware = true;
        
        responseData.softwareInfo = {
            productName: software.productName,
            softwareAccount: software.softwareAccount,
            softwarePassword: software.softwarePassword,
            playerId: software.playerId,
            licenseType: software.licenseType,
            licenseStatus: software.licenseStatus,
            deviceLimit: software.deviceLimit,
            activationDate: software.activationDate,
            endDate: software.endDate,
            startDate: software.startDate,
            softwareEndDate: software.endDate
        };
        responseData.softwareStatus = {
            swStatusLabel: softwareStatus.statusLabel,
            swRemainingDays: softwareStatus.remainingDays,
            swIsExpired: softwareStatus.isExpired
        };
    } else {
        responseData.isMaster = false;
        responseData.hasSoftware = false;
    }
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWarrantyById = async (req, res) => {
  try {
    const hardware = await Hardware.findById(req.params.id);
    if (!hardware) return res.status(404).json({ message: 'Not found' });
    
    // --- LOGIC CENTRALIZED (MIRRORS SEARCH) ---
    const statusInfo = hardwareService.getHardwareStatus(hardware);
    const responseData = {
      ...hardware.toObject(),
      ...statusInfo
    };

    let project = null;
    let software = null;
    const serialSN = hardware.serialNumber && hardware.serialNumber[0] ? hardware.serialNumber[0] : '';

    // 1. Resolve Project (New Data)
    if (hardware.projectId) {
         project = await Project.findById(hardware.projectId);
    }

    // 2. Populate Hardware Info (Project > Hardware)
    if (project) {
        responseData.customerCode = project.customerCode;
        responseData.companyName = project.companyName;
        responseData.taxCode = project.taxCode;
        responseData.customerPhone = project.customerPhone;
        responseData.projectTotal = project.totalQuantity;
        if (project.masterSerialNumber) responseData.masterSerial = project.masterSerialNumber;
    }

    // 3. Resolve Software (Robust Fallback)
    // Strategy A: Direct Link (Retail or Master)
    if (serialSN) {
        software = await Software.findOne({ relatedHardwareSerial: serialSN });
    }
    
    // Strategy B: Project Master (New Data)
    if (!software && project && project.masterSerialNumber) {
        software = await Software.findOne({ relatedHardwareSerial: project.masterSerialNumber });
    }
    
    // Strategy C: Customer Code Fallback (Legacy Data)
    if (!software && hardware.customerCode) {
        software = await Software.findOne({ customerCode: hardware.customerCode });
        // Auto-fix info
        if (software) {
            if (!responseData.companyName || responseData.companyName === '-') responseData.companyName = software.companyName;
            if (!responseData.taxCode) responseData.taxCode = software.taxCode;
        }
    }

    // 4. Force Display Logic
    if (software) {
        const { getSoftwareStatus } = require('../services/softwareService');
        const softwareStatus = getSoftwareStatus(software);
        
        // FORCE TRUE for Project/Group items to ensure they see the info
        // UPDATED for ID Lookup: Only isMaster if strictly matches.
        responseData.isMaster = (software.relatedHardwareSerial === (hardware.serialNumber ? hardware.serialNumber[0] : '')); 
        responseData.hasSoftware = true;
        
        responseData.softwareInfo = {
            productName: software.productName,
            softwareAccount: software.softwareAccount,
            softwarePassword: software.softwarePassword,
            playerId: software.playerId,
            licenseType: software.licenseType,
            licenseStatus: software.licenseStatus,
            deviceLimit: software.deviceLimit,
            activationDate: software.activationDate,
            endDate: software.endDate,
            startDate: software.startDate,
            softwareEndDate: software.endDate
        };
        responseData.softwareStatus = {
            swStatusLabel: softwareStatus.statusLabel,
            swRemainingDays: softwareStatus.remainingDays,
            swIsExpired: softwareStatus.isExpired
        };
    } else {
        responseData.isMaster = false;
        responseData.hasSoftware = false;
    }
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin handlers likely used by routes but handled via services? 
// The routes usually call controller methods. 
// I need checking generic methods.
// The previous controller didn't have create/update/delete?
// Ah, `warrantyRoutes.js` likely maps to `warrantyController` or uses services directly?
// Let's check `warrantyRoutes.js` in next step.
// `warrantyController` had `searchWarranty`, `getWarrantyById`.
// Where are Create/Update/Delete?
// `warrantyRoutes` might define them using `hardwareService` directly or controller methods?
// `warrantyRoutes` likely has: router.post('/', ...);

module.exports = {
  searchWarranty,
  getWarrantyById
};
