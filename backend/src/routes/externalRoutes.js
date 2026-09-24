const express = require('express');
const { getExternalProducts } = require('../controllers/externalController');

const router = express.Router();

router.get('/products', getExternalProducts);

module.exports = router;