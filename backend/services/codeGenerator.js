const generateCustomerCode = () => {
  // Format: KH + Timestamp (base36) + Random (base36)
  // Example: KH-LRA8Z-1X9
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `KH${timestamp}${random}`;
};

module.exports = {
  generateCustomerCode
};
