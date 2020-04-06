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

// when more than 1 url param is possible to the same route, mergeParams must to be set to true
const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(advancedResults(Redeem, 'redeems'), getRedeems)
    .post(createRedeem)

router
    .route('/:id')
    .get(getRedeem)
    .put(updateRedeem)
    .delete(deleteRedeem)


module.exports = router;
