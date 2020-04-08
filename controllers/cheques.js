const Cheque = require('../models/Cheque')
const Company = require('../models/Company')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Get cheques
// @route   GET /api/v1/users/:userId/cheques
// @route   GET /api/v1/companies/:companyId/cheques
// @route   GET /api/v1/cheques
// @access  Public
exports.getCheques = asyncHandler(async (req, res, next) => {
    let cheques
    if (req.params.userId) {
        cheques = await Cheque.find({ user: req.params.userId });

        return res.status(200).json({
            success: true,
            count: cheques.length,
            data: cheques
        });
    } else if (req.params.companyId) {
        cheques = await Cheque.find({ company: req.params.companyId });

        return res.status(200).json({
            success: true,
            count: cheques.length,
            data: cheques
        });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
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
    console.log(req.params);
    let cheques

    if (req.params.companyId) {
        // create multiple cheques for company
        req.body.company = req.params.companyId

        let company = await Company.findById(req.params.companyId)
        if (!company)
            return next(new ErrorResponse(`Company not found with id of ${req.params.companyId}`, 404))



    }
    else if (req.params.userId) {
        // Create cheque for user
        req.body.user = req.params.userId
        const user = await User.findById(req.params.userId)
        if (!user)
            return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404))

        cheques = await Cheque.create(req.body)

    }


    res.status(200).json({ success: true, data: cheque })
})


// @desc    Create Cheques
// @route   POST /api/v1/companies/:companyId/createCheques
// @access  Private
exports.createCheques = asyncHandler(async (req, res, next) => {
    console.log('hi')
    console.log(req.params);
    /* let cheques

    if (req.params.companyId) {
        // create multiple cheques for company
        req.body.company = req.params.companyId

        const company = await Company.findbyId(req.params.companyId)
        if (!company)
            return next(new ErrorResponse(`Company not found with id of ${req.params.companyId}`, 404))



    }
    else if (req.params.userId) {
        // Create cheque for user
        req.body.user = req.params.userId
        const user = await User.findById(req.params.userId)
        if (!user)
            return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404))

        cheques = await Cheque.create(req.body)

    }


    res.status(200).json({ success: true, data: cheque }) */
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