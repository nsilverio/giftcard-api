const Merchant = require('../models/Merchant')
const ErrorResponse = require('../utils/errorResponse')

// @desc    Get all merchants
// @route   GET /api/v1/merchants
// @access  Public
exports.getMerchants = async (req, res, next) => {
    try {
        const merchants = await Merchant.find()
        res.status(200).json({ success: true, count: merchants.length, data: merchants})
    } catch (error) {
        res.status(400).json({success: false })
    }
} 

// @desc    Get a single Merchant
// @route   GET /api/v1/merchants/:id
// @access  Public
exports.getMerchant = async (req, res, next) => {
    try {
        const merchant = await Merchant.findById(req.params.id)
        
        if(!merchant)
            return next(new ErrorResponse(`Merchant not found with id of ${req.params.id}`, 404))

        res.status(200).json({ success: true, data: merchant})
    } catch (error) {
        next(new ErrorResponse(`Merchant not found with id of ${req.params.id}`, 404))
    }
} 

// @desc    Create new Merchant
// @route   POST /api/v1/merchants
// @access  Private
exports.createMerchant = async (req, res, next) => {
    try {
        const merchant = await Merchant.create(req.body)

        res.status(201).json({
            success: true,
            data: merchant
        })
    } catch (error) {
      res.status(400).json( {success: false })  
    }
} 

// @desc    Update a Merchant
// @route   PUT /api/v1/merchants/:id
// @access  Private
exports.updateMerchant = async (req, res, next) => {
    try {
        const merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if(!merchant)
            res.status(400).json( {success: false })    
        
        res.status(201).json({
            success: true,
            data: merchant
        })
    } catch (error) {
      res.status(400).json( {success: false })  
    }
} 

// @desc    Delete a Merchant
// @route   GET /api/v1/merchants/:id
// @access  private
exports.deleteMerchant = async (req, res, next) => {
    try {
        const merchant = await Merchant.findByIdAndDelete(req.params.id)

        if(!merchant)
            res.status(400).json( {success: false })    
        
        res.status(201).json({
            success: true,
            data: {}
        })
    } catch (error) {
      res.status(400).json( {success: false })  
    }
} 
