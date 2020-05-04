const Redemption = require('../models/Redemption')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get redemptions
// @route   GET /api/v1/users/:userId/redemptions
// @route   GET /api/v1/companies/:companyId/redemptions
// @route   GET /api/v1/redemptions
// @access  Public
exports.getRedemptions = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

})

// @desc    Get redemption
// @route   GET /api/v1/redemptions/:id
// @access  Public
exports.getRedemption = asyncHandler(async (req, res, next) => {
    const redemption = await Redemption.findById(req.params.id)

    res.status(200).json({ success: true, data: redemption })
})



// @desc    Create Redemption
// @route   POST /api/v1/users/:userId/redemptions
// @access  Private
exports.createRedemption = asyncHandler(async (req, res, next) => {

    req.body.user = req.params.userId

    const user = await User.findById(req.params.userId)
    if (!user)
        return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404))

    const redemption = await Redemption.create(req.body)

    res.status(200).json({ success: true, data: redemption })
})


// @desc    Update redemption
// @route   PUT /api/v1/redemptions/redemptionId
// @access  Private
exports.updateRedemption = asyncHandler(async (req, res, next) => {

    let redemption = await Redemption.findById(req.params.id)

    if (!redemption) {
        return next(new ErrorResponse(`Redemption not found with id of ${req.params.id}`, 404))
    }
    redemption = await Redemption.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({ success: true, data: redemption })
})


// @desc    Delete redemption
// @route   DELETE /api/v1/redemption/redemptionId
// @access  Private
exports.deleteRedemption = asyncHandler(async (req, res, next) => {

    const redemption = await Redemption.findById(req.params.id)

    if (!redemption)
        return next(new ErrorResponse(`Redemption not found with id of ${req.params.id}`, 404))


    await redemption.remove()

    res.status(200).json({ success: true, data: {} })
})