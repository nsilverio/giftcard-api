const express = require('express')

const {
    getUsers,
    getUser,
    createUser
} = require('../controllers/users')

const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(getUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)


module.exports = router