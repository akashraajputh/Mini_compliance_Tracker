const express = require('express');
const clientController = require('../controllers/clientController');
const router = express.Router();

router.get('/', clientController.getAllClients);

module.exports = router;
