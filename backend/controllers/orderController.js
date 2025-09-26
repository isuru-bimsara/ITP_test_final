// controllers/orderController.js
const Order = require('../models/orderModel');


const getAllOrderIds = async (req, res) => {
    try {

        const orderIds = await Order.find({}, '_id');
        
        res.status(200).json(orderIds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order IDs', error: error.message });
    }
};

module.exports = {
    getAllOrderIds,
};