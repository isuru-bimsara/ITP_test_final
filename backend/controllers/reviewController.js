const asyncHandler = require('express-async-handler');
const Review = require('../models/review.model');
const Delivery = require('../models/delivery.model');


const createReview = asyncHandler(async (req, res) => {
    const { deliveryId, rating, comment } = req.body;
    
    const delivery = await Delivery.findById(deliveryId);

    // Validations
    if (!delivery) {
        res.status(404);
        throw new Error('Delivery not found');
    }
    if (delivery.customer.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('User not authorized to review this delivery');
    }
    if (delivery.status !== 'Delivered') {
        res.status(400);
        throw new Error('Delivery must be completed to be reviewed');
    }
    const alreadyReviewed = await Review.findOne({ delivery: deliveryId });
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Delivery already reviewed');
    }

    const review = await Review.create({
        customer: req.user._id,
        delivery: deliveryId,
        rating,
        comment,
    });

    res.status(201).json(review);
});


const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ customer: req.user._id }).populate({
        path: 'delivery',
        select: 'orderId deliveryAddress'
    });
    res.json(reviews);
});


const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({}).populate('customer', 'username').populate('delivery', 'orderId');
    res.json(reviews);
});

module.exports = { createReview, getMyReviews, getAllReviews };
