const express = require('express');
const router = express.Router();
const { getDeliveries, getMyDeliveries, createDelivery, updateDelivery } = require('../controllers/deliveryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').get(protect, isAdmin, getDeliveries).post(protect, createDelivery);
router.get('/my-orders', protect, getMyDeliveries);
router.route('/:id').put(protect, isAdmin, updateDelivery);

module.exports = router;
