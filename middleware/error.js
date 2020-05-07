const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {

    let error = { ...err }
    error.message = err.message

    // log to console to dev
    console.log(err)

    // Mongoose bad ObjectID
    if (err.name === 'CastError') {
        const message = `Resource not found`
        error = new ErrorResponse(message, 404)
    }

    // Mongoose duplicated field entered
    if (err.code === 11000) {
        const message = `Duplicated field entered`
        error = new ErrorResponse(message, 404)
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 404)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    })
}
module.exports = errorHandler