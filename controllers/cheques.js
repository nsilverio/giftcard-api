const Cheque = require('../models/Cheque')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get cheques
// @route   GET /api/v1/users/:userId/cheques
// @route   GET /api/v1/cheques
// @access  Public
exports.getCheques = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

// @desc    Get cheque
// @route   GET /api/v1/cheques/:id
// @access  Public
exports.getCheque = asyncHandler(async (req, res, next) => {
    const cheque = await Cheque.findById(req.params.id)
        .populate('user')
        .populate('company')
    if (!cheque)
        return next(new ErrorResponse(`Cheque not found with id of ${req.params.id}`, 404))

    res.status(200).json({ success: true, data: cheque })
})



// @desc    Create Cheque
// @route   POST /api/v1/users/:userId/cheques
// @access  Private
exports.createCheque = asyncHandler(async (req, res, next) => {

    req.body.user = req.params.userId

    const user = await User.findById(req.params.userId)
    if (!user)
        return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404))

    const cheque = await Cheque.create(req.body)

    res.status(200).json({ success: true, data: cheque })
})

// @desc    Update cheque
// @route   PUT /api/v1/cheques/chequeId
// @access  Private
exports.updateCheque = asyncHandler(async (req, res, next) => {


    let cheque = await Cheque.findById(req.params.id)

    if (!cheque) {
        return next(new ErrorResponse(`Cheque not found with id of ${req.params.id}`, 404))
    }
    cheque = await Cheque.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({ success: true, data: cheque })
})


// @desc    Delete cheque
// @route   DELETE /api/v1/cheque/chequeId
// @access  Private
exports.deleteCheque = asyncHandler(async (req, res, next) => {

    const cheque = await Cheque.findById(req.params.id)

    if (!cheque)
        return next(new ErrorResponse(`Cheque not found with id of ${req.params.id}`, 404))

    await cheque.remove()

    res.status(200).json({ success: true, data: {} })
})