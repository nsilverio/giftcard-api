const express = require('express')

const {
    getMerchants,
    getMerchant,
    createMerchant,
    updateMerchant,
    deleteMerchant,
    merchantPhotoUpload
} = require('../controllers/merchants');

// Photo upload  
const Merchant = require('../models/Merchant')
const uploadPhoto = require('../middleware/uploadPhoto')

// Advanced results
const advancedResults = require('../middleware/advancedResults')

const router = express.Router()
// add protection to routes where user needs to be authorized
const { protect } = require('../middleware/auth')

router.route('/:id/photo').put(protect, uploadPhoto(Merchant, 'merchants'), merchantPhotoUpload)


router
    .route('/')
    .get(protect, advancedResults(Merchant, 'merchants'), getMerchants)
    .post(protect, createMerchant)

router
    .route('/:id')
    .get(protect, getMerchant)
    .put(protect, updateMerchant)
    .delete(protect, deleteMerchant)

module.exports = router;
