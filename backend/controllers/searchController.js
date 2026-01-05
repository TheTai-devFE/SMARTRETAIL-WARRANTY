const { hardwareService, softwareService } = require('../services');
const Hardware = require('../models/Hardware');
const Software = require('../models/Software');

/**
 * Public Search API: Search by Customer Code + Tax Code
 * Returns array of products (Hardware + Software)
 */
const searchProducts = async (req, res) => {
  try {
    const { customerCode, taxCode, customerPhone } = req.body;
    
    if (!customerCode) {
        return res.status(400).json({ message: 'Mã khách hàng là bắt buộc' });
    }

    if (!taxCode && !customerPhone) {
        return res.status(400).json({ message: 'Mã số thuế hoặc Số điện thoại là bắt buộc' });
    }

    const cleanCode = customerCode.trim();
    const query = { customerCode: cleanCode };
    
    if (taxCode) {
        query.taxCode = taxCode.trim();
    } else if (customerPhone) {
        query.customerPhone = customerPhone.trim();
    }

    // Parallel search
    const [hardwareList, softwareList] = await Promise.all([
        Hardware.find(query),
        Software.find(query)
    ]);

    if (hardwareList.length === 0 && softwareList.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Format results
    const hardwareFormatted = hardwareList.map(h => ({
        type: 'Hardware',
        ...h.toObject(),
        ...hardwareService.getHardwareStatus(h)
    }));
    
    const softwareFormatted = softwareList.map(s => ({
        type: 'Software',
        ...s.toObject(),
        ...softwareService.getSoftwareStatus(s)
    }));

    const response = {
        customerCode: cleanCode,
        products: [...hardwareFormatted, ...softwareFormatted]
    };

    if (taxCode) response.taxCode = taxCode.trim();
    if (customerPhone) response.customerPhone = customerPhone.trim();

    res.json(response);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Legacy Search (Serial Number) - Optional, keep valid?
const searchBySerial = async (req, res) => {
    try {
        const { serialNumber } = req.body;
        if (!serialNumber) return res.status(400).json({message: 'Serial missing'});
        const cleanSN = serialNumber.trim();
        
        // Try Hardware
        const hardware = await Hardware.findOne({ serialNumber: cleanSN });
        if (hardware) {
             return res.json({
                 type: 'Hardware',
                 ...hardware.toObject(),
                 ...hardwareService.getHardwareStatus(hardware)
             });
        }
        
        // Try Software (unlikely searched by serial? Maybe relatedHardwareSerial?)
        // Or if searching by key?
        return res.status(404).json({ message: 'Not found' });
        
    } catch(e) {
        res.status(500).json(e);
    }
};

module.exports = {
  searchProducts,
  searchBySerial
};
