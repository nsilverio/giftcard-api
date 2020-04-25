const express = require('express')

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    userPhotoUpload
} = require('../controllers/users')

const User = require('../models/User')

// Photo upload  
const uploadPhoto = require('../middleware/uploadPhoto')

// Advanced results
const advancedResults = require('../middleware/advancedResults')

// Include other resource routers
const chequeRouter = require('./cheques')
const reddemRouter = require('./redemptions')

const router = express.Router({ mergeParams: true })

// add protection to routes where user needs to be authorized
const { protect, authorize } = require('../middleware/auth')

// Re-route into another resources routers
router.use('/:userId/cheques', chequeRouter)
router.use('/:userId/redemptions', reddemRouter)

router.route('/:id/photo').put(protect, authorize('user'), uploadPhoto(User, 'users'), userPhotoUpload)

router
    .route('/')
    .get(protect, authorize('root'), advancedResults(User, 'users'), getUsers)
    .post(protect, authorize('administrator', 'root'), createUser)

router
    .route('/:id')
    .get(protect, authorize('administrator', 'root', 'user'), getUser)
    .put(protect, authorize('administrator', 'root', 'user'), updateUser)
    .delete(protect, authorize('administrator', 'root'), deleteUser)


module.exports = router