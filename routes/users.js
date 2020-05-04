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
const { protect, authorize, checkDomainOwnership } = require('../middleware/auth')

router.use(protect)
router.use(checkDomainOwnership(User))

// Re-route into another resources routers
router.use('/:userId/cheques', chequeRouter)
router.use('/:userId/redemptions', reddemRouter)

router.route('/:id/photo').put(authorize('user'), uploadPhoto(User, 'users'), userPhotoUpload)

router
    .route('/')
    .get(authorize('root', 'administrator'), advancedResults(User, 'users'), getUsers)
    .post(authorize('administrator', 'root'), createUser)

router
    .route('/:id')
    .get(authorize('administrator', 'root', 'user'), getUser)
    .put(authorize('administrator', 'root', 'user'), updateUser)
    .delete(authorize('administrator', 'root'), deleteUser)


module.exports = router