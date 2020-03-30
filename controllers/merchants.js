const Merchant = require('../models/Merchant')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get all merchants
// @route   GET /api/v1/merchants
// @access  Public
exports.getMerchants = asyncHandler(async (req, res, next) => {
    const merchants = await Merchant.find()

    res.status(200).json({ success: true, count: merchants.length, data: merchants })
})

// @desc    Get a single Merchant
// @route   GET /api/v1/merchants/:id
// @access  Public
exports.getMerchant = asyncHandler(async (req, res, next) => {
    const merchant = await Merchant.findById(req.params.id)

    if (!merchant)
        return next(new ErrorResponse(`Merchant not found with id of ${req.params.id}`, 404))

    res.status(200).json({ success: true, data: merchant })

})

// @desc    Create new Merchant
// @route   POST /api/v1/merchants
// @access  Private
exports.createMerchant = asyncHandler(async (req, res, next) => {
    const merchant = await Merchant.create(req.body)

    // Corrected formated object ID that does not exist in the database
    if (!merchant)
        res.status(400).json({ success: false })

    res.status(201).json({
        success: true,
        data: merchant
    })
})

// @desc    Update a Merchant
// @route   PUT /api/v1/merchants/:id
// @access  Private
exports.updateMerchant = asyncHandler(async (req, res, next) => {

    const merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!merchant)
        return next(new ErrorResponse(`Merchant not found with id of ${req.params.id}`, 404))

    res.status(201).json({
        success: true,
        data: merchant
    })
})

// @desc    Delete a Merchant
// @route   GET /api/v1/merchants/:id
// @access  private
exports.deleteMerchant = asyncHandler(async (req, res, next) => {
    const merchant = await Merchant.findByIdAndDelete(req.params.id)

    if (!merchant)
        return next(new ErrorResponse(`Merchant not found with id of ${req.params.id}`, 404))

    res.status(201).json({
        success: true,
        data: {}
    })

})
