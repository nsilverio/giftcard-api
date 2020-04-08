const express = require('express')

const {
    getCheques,
    getCheque,
    deleteCheque,
    createCheque,
    updateCheque,
    createCheques
} = require('../controllers/cheques')

// access params from the parent router
const router = express.Router({ mergeParams: true })

// Advanced results 
const Cheque = require('../models/Cheque')
const advancedResults = require('../middleware/advancedResults')


/* Mauricio


POST /api/v1/companies/:companyId/createCheques quero que chame controllers/cheques/createCheques 
mas esta chamando controllers/cheques/createCheque
veja como esta /routes/companies.js pois pode ser que nao esteja funcionando porque la faco uso do 
router de cheques 
*/



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
