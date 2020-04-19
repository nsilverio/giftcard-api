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
const reddemRouter = require('./redeems')

const router = express.Router({ mergeParams: true })

// add protection to routes where user needs to be authorized
const { protect } = require('../middleware/auth')

// Re-route into another resources routers
router.use('/:userId/cheques', chequeRouter)
router.use('/:userId/redeems', reddemRouter)

router.route('/:id/photo').put(protect, uploadPhoto(User, 'users'), userPhotoUpload)



router
    .route('/')
    .get(protect, advancedResults(User, 'users'), getUsers)
    .post(protect, createUser)

router
    .route('/:id')
    .get(protect, getUser)
    .put(protect, updateUser)
    .delete(protect, deleteUser)


module.exports = router