const express = require('express');
const router = express.Router();
const softwareController = require('../controllers/softwareController');

// Admin - Software CRUD
router.post('/', softwareController.createSoftware);
router.get('/', softwareController.getAllSoftware);
router.put('/:id', softwareController.updateSoftware);
router.delete('/:id', softwareController.deleteSoftware);
router.post('/bulk-delete', softwareController.bulkDeleteSoftware);
router.post('/:id/activate', softwareController.activateSoftware);

module.exports = router;
