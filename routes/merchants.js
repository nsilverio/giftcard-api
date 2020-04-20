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
const { protect, authorize } = require('../middleware/auth')

router.route('/:id/photo').put(protect, authorize('administrator'), uploadPhoto(Merchant, 'merchants'), merchantPhotoUpload)


router
    .route('/')
    .get(protect, authorize('administrator', 'root', 'user'), advancedResults(Merchant, 'merchants'), getMerchants)
    .post(protect, authorize('root'), createMerchant)

router
    .route('/:id')
    .get(protect, authorize('administrator', 'root', 'user'), getMerchant)
    .put(protect, authorize('root'), updateMerchant)
    .delete(protect, authorize('root'), deleteMerchant)

module.exports = router;
