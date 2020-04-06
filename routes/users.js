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


// Re-route into another resources routers
router.use('/:userId/cheques', chequeRouter)
router.use('/:userId/redeems', reddemRouter)

router.route('/:id/photo').put(uploadPhoto(User, 'users'), userPhotoUpload)



router
    .route('/')
    .get(advancedResults(User, 'users'), getUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)


module.exports = router