const express = require('express')

const {
    getCheques,
    getCheque,
    deleteCheque,
    createCheque,
    updateCheque,
} = require('../controllers/cheques')

// when more than 1 url param is possible to the same route, mergeParams must to be set to true
const router = express.Router({ mergeParams: true })

// Advanced results 
const Cheque = require('../models/Cheque')
const advancedResults = require('../middleware/advancedResults')

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
