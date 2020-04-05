const express = require('express')
const path = require('path')

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    userPhotoUpload
} = require('../controllers/users')


// Include other resource routers
const chequeRouter = require('./cheques')
const reddemRouter = require('./redeems')

const router = express.Router({ mergeParams: true })


// Re-route into another resources routers
router.use('/:userId/cheques', chequeRouter)
router.use('/:userId/redeems', reddemRouter)

router.route('/:id/photo').put(userPhotoUpload)

router
    .route('/')
    .get(getUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)


module.exports = router