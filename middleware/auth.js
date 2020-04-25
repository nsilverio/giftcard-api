const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('./async')
const User = require('../models/User')

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];

        // Set token from cookie
    }
    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded.id);

        // add user to request
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specifi roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} not authorized to access this route`, 403));
        }
        next()
    }
}




exports.checkDomainOwnership = model =>
    asyncHandler(async (req, res, next) => {

        // check company against current logged user company
        const checkCompanyDomain = company => company === req.user.company.toString()
        const checkUserDomain = user => user === req.user._id.toString()


        // get all by companyId : administrators
        if (req.params.companyId) {
            if (req.user.role !== 'administrator') {
                return next(new ErrorResponse(`User has no privilege to access this route`, 401))
            }
            if (!checkCompanyDomain(req.params.companyId.toString())) {
                return next(new ErrorResponse(`User not authorized to access this company domain 1`, 401))
            }
        }

        // get all by userId : administrators, users
        if (req.params.userId) {
            const user = await User.findById(req.params.userId)
            if (!user) {
                new ErrorResponse(`User not found with id:${req.params.id}`, 404)
            }

            // validate company domain for administrators and users 
            if (!checkCompanyDomain(user.company.toString())) {
                return next(new ErrorResponse(`User not authorized to access this company domain 2`, 401))
            }

            // limit domain to logged user company only for users with no administration rights
            if (req.user.role !== 'administrator') {
                if (!checkUserDomain(req.params.userId)) {
                    return next(new ErrorResponse(`User not authorized to access this user domain 1`, 401))
                }
            }

        }

        //get byId: administrators, users 
        if (req.params.id) {
            let resource = await model.findById(req.params.id)

            if (!resource) {
                return next(
                    new ErrorResponse(`Resource not found with id:${req.params.id}`, 404)
                )
            }

            // validate company domain
            if (req.user.company.toString() !== resource.company.toString()) {
                return next(new ErrorResponse(`User not authorized to access this company domain 3`, 401))
            }

            // validate user domain
            if (req.user.role === 'user') {

                if (resource.user.toString() !== req.user._id.toString()) {
                    return next(new ErrorResponse(`User not authorized to access this user domain 4`, 401))
                }
            }
        }

        next()
    });

