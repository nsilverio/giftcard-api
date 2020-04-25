const express = require('express')

const {
    getRedemptions,
    getRedemption,
    createRedemption,
    updateRedemption,
} = require('../controllers/redemptions')

// Advanced results 
const Redemption = require('../models/Redemption')
const advancedResults = require('../middleware/advancedResults')

// add protection to routes where user needs to be authorized
const { protect, authorize, checkDomainOwnership } = require('../middleware/auth')

// when more than 1 url param is possible to the same route, mergeParams must to be set to true
const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(protect, authorize('user'), checkDomainOwnership(Redemption), advancedResults(Redemption, 'redemptions'), getRedemptions)
    .post(protect, authorize('user'), checkDomainOwnership(Redemption), createRedemption)

router
    .route('/:id')
    .get(protect, authorize('user'), checkDomainOwnership(Redemption), getRedemption)
    .put(protect, authorize('user'), checkDomainOwnership(Redemption), updateRedemption)


module.exports = router;
