const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');


const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});


module.exports = { getUserProfile, getUsers };

