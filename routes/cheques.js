const express = require('express')

const {
    getCheques,
    getCheque,
    createCheque,
    uploadCheques
} = require('../controllers/cheques')

// access params from the parent router
const router = express.Router({ mergeParams: true })

// Advanced results 
const Cheque = require('../models/Cheque')
const advancedResults = require('../middleware/advancedResults')

// add protection to routes where user needs to be authorized
const { protect, authorize, checkDomainOwnership } = require('../middleware/auth')

router.route('/upload').post(protect, authorize('administrator'), checkDomainOwnership(Cheque), uploadCheques)

router
    .route('/')
    .get(protect, authorize('administrator', 'user'), checkDomainOwnership(Cheque), advancedResults(Cheque, 'cheques'), getCheques)
    .post(protect, authorize('administrator'), checkDomainOwnership(Cheque), createCheque)


router
    .route('/:id')
    .get(protect, authorize('administrator', 'user'), checkDomainOwnership(Cheque), getCheque)


module.exports = router;
