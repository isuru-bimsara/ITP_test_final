// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    getUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');


router.route('/').get(protect, getUsers);

router
    .route('/profile')
    .get(protect, getUserProfile)

module.exports = router;

