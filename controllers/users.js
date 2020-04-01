const Users = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get users
// @route   GET /api/v1/users
// @route   GET /api/v1/companies/:companyId/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.companyId) {
        query = Users.find({ company: req.params.companyId })
    } else {
        query = Users.find()
    }
    const users = await query;

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    })
})