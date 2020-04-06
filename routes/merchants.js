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


const router = express.Router()

router.route('/:id/photo').put(uploadPhoto(Merchant, 'merchants'), merchantPhotoUpload)


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
