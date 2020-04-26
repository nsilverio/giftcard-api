
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc    Register user 
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, company, password, role } = req.body

    // Create the user
    const user = await User.create({
        name,
        email,
        password,
        company,
        role
    })

    sendTokenresponse(user, 200, res)

})

// @desc    Login user 
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body

    // validate email and password 
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an username and password', 400))
    }

    // check for user
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    // check if password matches 
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    sendTokenresponse(user, 200, res)
})

// @desc    Get current logged un user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })

})

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorResponse(`There is no user registered with email ${req.body.email}`, 404))
    }

    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        data: user
    })

})

// get token from model, create cookie and send response
const sendTokenresponse = (user, statusCode, res) => {
    // create token 
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // add 30 days to date
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }


    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}