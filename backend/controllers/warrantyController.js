const Warranty = require('../models/Warranty');
const { hardwareService, softwareService } = require('../services');

/**
 * Public Search API with Master-Member masking logic
 */
const searchWarranty = async (req, res) => {
  try {
    const { serialNumber, taxCode, customerPhone } = req.body;
    
    if (!serialNumber) {
      return res.status(400).json({ message: 'Serial number is required' });
    }

    const trimmedSN = serialNumber.trim();
    // Use regex for serialNumber to be case-insensitive and robust
    // Searching within the array: Mongoose handles this automatically if any element matches
    let query = { serialNumber: { $regex: new RegExp(`^${trimmedSN}$`, 'i') } };
    
    if (taxCode && taxCode.trim()) {
      query.taxCode = taxCode.trim();
    } else if (customerPhone && customerPhone.trim()) {
      query.customerPhone = customerPhone.trim();
    } else {
      return res.status(400).json({ message: 'Tax Code or Phone Number is required' });
    }

    const warranty = await Warranty.findOne(query);
    
    if (!warranty) {
      return res.status(404).json({ message: 'No warranty record found' });
    }

    // Apply masking logic based on searched SN vs Master SN
    const dataWithMasking = softwareService.getMaskedSoftwareInfo(warranty, trimmedSN);
    
    // Add activation status labels
    const statusInfo = hardwareService.getHardwareStatus(warranty);

    res.json({
      ...dataWithMasking,
      ...statusInfo
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get Warranty by ID (for internal/admin use or activation check)
 */
const getWarrantyById = async (req, res) => {
  try {
    const warranty = await Warranty.findById(req.params.id);
    if (!warranty) return res.status(404).json({ message: 'Not found' });
    
    // Apply masking logic based on its own serial (since records are now individual)
    const dataWithMasking = softwareService.getMaskedSoftwareInfo(warranty, warranty.serialNumber[0]);
    
    res.json({
      ...dataWithMasking,
      ...hardwareService.getHardwareStatus(warranty)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchWarranty,
  getWarrantyById
};
