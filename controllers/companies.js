
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

// @desc    Get company
// @route   GET /api/v1/companies/companyId
// @access  Public
exports.getCompany = asyncHandler(async (req, res, next) => {


    let company = await Company.findById(req.params.id).populate('users')

    if (!company) {
        return next(new ErrorResponse(`Company not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: company
    })
})

// @desc    Create company
// @route   POST /api/v1/companies
// @access  Private
exports.createCompany = asyncHandler(async (req, res, next) => {

    const company = await Company.create(req.body)

    // Corrected formated object ID that does not exist in the database
    if (!company)
        res.status(400).json({ success: false })

    res.status(200).json({ success: true, data: company })
})


// @desc    Update company
// @route   PUT /api/v1/companies/companyId
// @access  Private
exports.updateCompany = asyncHandler(async (req, res, next) => {

    let company = await Company.findById(req.params.id)

    if (!company) {
        return next(new ErrorResponse(`Company not found with id of ${req.params.id}`, 404))

    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({ success: true, data: company })
})

// @desc    Delete a company
// @route   DELETE /api/v1/company/:id
// @access  private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
    /* in order to trigger the cascade delete of users when a company is delete the 
        method findByIdAndDelete should be replaced by findById and them remove() 
    */
    const company = await Company.findById(req.params.id)

    if (!company)
        return next(new ErrorResponse(`Company not found with id of ${req.params.id}`, 404))

    company.remove();

    res.status(200).json({ success: true, data: {} })
})

// @desc    Upload photo for a company
// @route   PUT /api/v1/companies/:id/photo
// @access  private
exports.companyPhotoUpload = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id)

    if (!company)
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))

    res.status(200).json(res.uploadPhoto)
})
