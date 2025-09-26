
const express = require('express');
const router = express.Router();
const { getAllOrderIds } = require('../controllers/orderController');


router.get('/ids', getAllOrderIds);

module.exports = router;