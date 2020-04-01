
const Company = require('../models/Company')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = asyncHandler(async (req, res, next) => {
    let query = Company.find()

    const companies = await query;

    res.status(200).json({
        success: true,
        count: companies.length,
        data: companies
    })
})