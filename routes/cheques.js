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
const { protect } = require('../middleware/auth')

router.route('/upload').post(protect, uploadCheques)

router
    .route('/')
    .get(protect, advancedResults(Cheque, 'cheques'), getCheques)
    .post(protect, createCheque)


router
    .route('/:id')
    .get(protect, getCheque)
    .put(protect, updateCheque)
    .delete(protect, deleteCheque)


module.exports = router;
