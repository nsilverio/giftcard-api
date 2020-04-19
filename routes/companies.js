const express = require('express')

const {
    getCompanies,
    getCompany,
    deleteCompany,
    createCompany,
    updateCompany,
    companyPhotoUpload
} = require('../controllers/companies')

// Photo upload  
const Company = require('../models/Company')
const uploadPhoto = require('../middleware/uploadPhoto')


// Include other resource routers 
const userRouter = require('./users')
const chequeRouter = require('./cheques')
const redeemRouter = require('./redeems')

// access params from the parent router
const router = express.Router({ mergeParams: true })

// Re-route into another resources routers
router.use('/:companyId/users', userRouter)
router.use('/:companyId/cheques', chequeRouter)
router.use('/:companyId/redeems', redeemRouter)

// add protection to routes where user needs to be authorized
const { protect } = require('../middleware/auth')


router.route('/:id/photo').put(protect, uploadPhoto(Company, 'companies'), companyPhotoUpload)

router
    .route('/')
    .get(protect, getCompanies)
    .post(protect, createCompany)

router
    .route('/:id')
    .get(protect, getCompany)
    .put(protect, updateCompany)
    .delete(protect, deleteCompany)


module.exports = router;
