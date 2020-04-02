const User = require('../models/User')
const Company = require('../models/Company')
const Cheque = require('../models/Cheque')
const Redeem = require('../models/Redeem')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get users
// @route   GET /api/v1/companies/:companyId/users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.companyId) {
        query = User.find({ company: req.params.companyId }).populate({
            path: 'company',
            select: 'name currency'
        })
    } else {
        query = User.find().populate({
            path: 'company',
            select: 'name currency'
        })
            .populate('cheques')
            .populate('redeems')

    }
    const users = await query;

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    })
})

// @desc    Get user
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
        .populate({
            path: 'company',
            select: 'name currency'
        })
        .populate('cheques')
        .populate('redeems')
    if (!user)
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))

    res.status(200).json({ success: true, data: user })
})


// @desc    Create User
// @route   POST /api/v1/companies/:companyId/users
// @access  Private
exports.createUser = asyncHandler(async (req, res, next) => {

    req.body.company = req.params.companyId

    const company = await Company.findById(req.params.companyId)
    if (!company)
        return next(new ErrorResponse(`Company not found with id of ${req.params.companyId}`, 404))

    const user = await User.create(req.body)

    res.status(200).json({ success: true, data: user })
})

// @desc    Update user
// @route   PUT /api/v1/users/userId
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {

    let user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({ success: true, data: user })
})


// @desc    Delete user
// @route   DELETE /api/v1/user/userId
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user)
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))


    await user.remove()

    res.status(200).json({ success: true, data: {} })
})