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

router.use(protect)
router.use(authorize('user'))
router.use(checkDomainOwnership(Redemption))

router
    .route('/')
    .get(advancedResults(Redemption, 'redemptions'), getRedemptions)
    .post(createRedemption)

router
    .route('/:id')
    .get(getRedemption)
    .put(updateRedemption)


module.exports = router;
