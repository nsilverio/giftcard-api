const express = require('express')

const {
    getRedeems,
    getRedeem,
    deleteRedeem,
    createRedeem,
    updateRedeem,
} = require('../controllers/redeems')

// Advanced results 
const Redeem = require('../models/Redeem')
const advancedResults = require('../middleware/advancedResults')

// add protection to routes where user needs to be authorized
const { protect } = require('../middleware/auth')

// when more than 1 url param is possible to the same route, mergeParams must to be set to true
const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(protect, advancedResults(Redeem, 'redeems'), getRedeems)
    .post(protect, createRedeem)

router
    .route('/:id')
    .get(protect, getRedeem)
    .put(protect, updateRedeem)
    .delete(protect, deleteRedeem)


module.exports = router;
