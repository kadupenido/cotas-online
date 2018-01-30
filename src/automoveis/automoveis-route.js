const express = require('express');
const router = express.Router();
const automoveisController = require('./automoveis-controller');

router.get('/', automoveisController.getCotas);

module.exports = router;
