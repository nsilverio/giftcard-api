
const Company = require('../models/Company')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = asyncHandler(async (req, res, next) => {
    let query = Company.find().populate('users')

    const companies = await query;

    res.status(200).json({
        success: true,
        count: companies.length,
        data: companies
    })
})

// @desc    Delete a company
// @route   GET /api/v1/company/:id
// @access  private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
    /* in order to trigger the cascade delete of users when a company is delete the 
        method findByIdAndDelete should be replaced by findById and them remove() 
    */
    const company = await Company.findById(req.params.id)

    if (!company)
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

    company.remove();

    res.status(200).json({ success: true, data: {} })
})