const express = require('express')

const {
    getCheques,
    getCheque,
    deleteCheque,
    createCheque,
    updateCheque,
    uploadCheques
} = require('../controllers/cheques')

// access params from the parent router
const router = express.Router({ mergeParams: true })

// Advanced results 
const Cheque = require('../models/Cheque')
const advancedResults = require('../middleware/advancedResults')

// add protection to routes where user needs to be authorized
const { protect, authorize } = require('../middleware/auth')

router.route('/upload').post(protect, authorize('administrator'), uploadCheques)

router
    .route('/')
    .get(protect, authorize('administrator', 'root', 'user'), advancedResults(Cheque, 'cheques'), getCheques)
    .post(protect, authorize('administrator'), createCheque)


router
    .route('/:id')
    .get(protect, authorize('administrator', 'root', 'user'), getCheque)
    .put(protect, authorize('administrator'), updateCheque)
    .delete(protect, authorize('administrator'), deleteCheque)


module.exports = router;
