const express = require('express')

const {
    getMerchants,
    getMerchant,
    createMerchant,
    updateMerchant,
    deleteMerchant,
    merchantPhotoUpload
} = require('../controllers/merchants');

const Merchant = require('../models/Merchant')

// Photo upload  
const uploadPhoto = require('../middleware/uploadPhoto')

// Advanced results
const advancedResults = require('../middleware/advancedResults')

const router = express.Router()

router.route('/:id/photo').put(uploadPhoto(Merchant, 'merchants'), merchantPhotoUpload)


router
    .route('/')
    .get(advancedResults(Merchant, 'merchants'), getMerchants)
    .post(createMerchant)

router
    .route('/:id')
    .get(getMerchant)
    .put(updateMerchant)
    .delete(deleteMerchant)

module.exports = router;
