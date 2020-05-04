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

router.use(protect)
router.use(checkDomainOwnership(Cheque))

router.route('/upload').post(authorize('administrator'), uploadCheques)

router
    .route('/')
    .get(authorize('administrator', 'user'), advancedResults(Cheque, 'cheques'), getCheques)
    .post(authorize('administrator'), createCheque)


router
    .route('/:id')
    .get(authorize('administrator', 'user'), getCheque)


module.exports = router;
