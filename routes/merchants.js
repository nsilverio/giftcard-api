const express = require('express')

const {
    getMerchants,
    getMerchant,
    createMerchant,
    updateMerchant,
    deleteMerchant
} = require('../controllers/merchants');

const router = express.Router()

router
    .route('/')
    .get(getMerchants)
    .post(createMerchant)

router
    .route('/:id')
    .get(getMerchant)
    .put(updateMerchant)
    .delete(deleteMerchant)

module.exports = router;
