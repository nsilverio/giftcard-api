
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

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

    sendTokenResponse(user, 200, res)

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

    sendTokenResponse(user, 200, res)
})

// @desc    Log user out / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        data: {}
    })

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

    // create reset url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password.
    Please <a href='${resetUrl}'>click here</a> to reset it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset',
            message
        })

        res.status(200).json({
            success: true,
            data: 'Please follow the email instructions to reset your password'
        })
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })
        return next(new ErrorResponse(`Email could not be sent`, 500))


    }

})
// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
})


// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })

})

// @desc    Update user password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password')

    // check current password
    if (!await user.matchPassword(req.body.currentPassword)) {
        return next(new ErrorResponse('Current password is incorrect', 404));
    }

    user.password = req.body.newPassword
    await user.save()
    sendTokenResponse(user, 200, res)


})

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
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