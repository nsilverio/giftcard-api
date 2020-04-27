const express = require('express')

const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword
} = require('../controllers/auth')

// add protection to routes where user needs to be authorized
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)


module.exports = router