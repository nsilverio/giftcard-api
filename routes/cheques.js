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

router.route('/upload').post(uploadCheques)

router
    .route('/')
    .get(advancedResults(Cheque, 'cheques'), getCheques)
    .post(createCheque)


router
    .route('/:id')
    .get(getCheque)
    .put(updateCheque)
    .delete(deleteCheque)


module.exports = router;
