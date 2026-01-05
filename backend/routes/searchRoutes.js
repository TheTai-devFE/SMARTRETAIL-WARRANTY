const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Public Search
router.post('/', searchController.searchProducts);
// Legacy Serial Search could be here too or keep in warrantyRoutes
// router.post('/serial', searchController.searchBySerial);

module.exports = router;
