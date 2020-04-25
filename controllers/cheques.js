const Cheque = require('../models/Cheque')
const Company = require('../models/Company')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const path = require('path')
const fs = require('fs')
const XLSX = require('xlsx');


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

// @desc    Upload Cheques
// @route   POST v1/companies/:companyId/cheques/upload
// @access  Private
exports.uploadCheques = asyncHandler(async (req, res, next) => {

    let company = await Company.findById(req.params.companyId)
    if (!company)
        return next(new ErrorResponse(`Company not found with id of ${req.params.companyId}`, 404))

    // file upload
    if (!req.files)
        return next(new ErrorResponse(`Please upload a file`, 400))

    const file = req.files.file


    // make sure file is a valid spreadsheet
    if (!file.mimetype.startsWith('application/vnd.')) {
        return next(new ErrorResponse(`Please upload an valid spreadsheet file`, 400))
    }

    // make sure image is  not lager than limit
    if (!file.filesize > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload a file smaller than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    // Create custom filename 
    file.name = `cheques_${req.params.companyId}${path.parse(file.name).ext}`

    const pathTofile = `${process.env.FILE_UPLOAD_PATH}/${file.name}`

    // Upload file
    file.mv(pathTofile, async err => {
        if (err) {
            console.log(err)
            return next(new ErrorResponse(`Error uploading file`, 500))
        }

        // read xlsx file
        const wb = XLSX.readFile(pathTofile);
        // get worksheet name 
        const sheet_name_list = wb.SheetNames;
        const ws = wb.Sheets[sheet_name_list[0]]

        // Files with no header 
        //const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) 

        // Files with header 
        const worksheetData = XLSX.utils.sheet_to_json(ws)

        let cheques = [], usersNotFound = [], success = false

        for (const row of worksheetData) {

            const user = await User.findOne({ email: row.Email, company: req.params.companyId })
            if (user) {
                const cheque = { user: user.id, company: req.params.companyId, amount: row.Amount }
                cheques.push(cheque)


            }
            else {
                usersNotFound.push({ email: row.Email, amount: row.Amount })
            }
        }
        if (cheques.length > 0) {
            success = true
            await Cheque.create(cheques)
        }
        // delete file
        fs.unlinkSync(pathTofile)


        res.status(200).json({ success: success, data: cheques, usersNotFound: usersNotFound })

    })

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