const Redeem = require('../models/Redeem')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get redeems
// @route   GET /api/v1/users/:userId/redeems
// @route   GET /api/v1/redeems
// @access  Public
exports.getRedeems = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

// @desc    Get redeem
// @route   GET /api/v1/redeems/:id
// @access  Public
exports.getRedeem = asyncHandler(async (req, res, next) => {
    const redeem = await Redeem.findById(req.params.id)
    if (!redeem)
        return next(new ErrorResponse(`Redeem not found with id of ${req.params.id}`, 404))

    res.status(200).json({ success: true, data: redeem })
})



// @desc    Create Redeem
// @route   POST /api/v1/users/:userId/redeems
// @access  Private
exports.createRedeem = asyncHandler(async (req, res, next) => {

    req.body.user = req.params.userId
    console.log(req.params.userId);


    const user = await User.findById(req.params.userId)
    if (!user)
        return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404))

    const redeem = await Redeem.create(req.body)

    res.status(200).json({ success: true, data: redeem })
})

// @desc    Update redeem
// @route   PUT /api/v1/redeems/redeemId
// @access  Private
exports.updateRedeem = asyncHandler(async (req, res, next) => {


    let redeem = await Redeem.findById(req.params.id)

    if (!redeem) {
        return next(new ErrorResponse(`Redeem not found with id of ${req.params.id}`, 404))
    }
    redeem = await Redeem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({ success: true, data: redeem })
})


// @desc    Delete redeem
// @route   DELETE /api/v1/redeem/redeemId
// @access  Private
exports.deleteRedeem = asyncHandler(async (req, res, next) => {

    const redeem = await Redeem.findById(req.params.id)

    if (!redeem)
        return next(new ErrorResponse(`Redeem not found with id of ${req.params.id}`, 404))


    await redeem.remove()

    res.status(200).json({ success: true, data: {} })
})