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
const { protect, authorize } = require('../middleware/auth')


router.route('/:id/photo').put(protect, authorize('administrator', 'root'), uploadPhoto(Company, 'companies'), companyPhotoUpload)

router
    .route('/')
    .get(protect, authorize('root'), getCompanies)
    .post(protect, authorize('root'), createCompany)

router
    .route('/:id')
    .get(protect, authorize('administrator', 'root', 'user'), getCompany)
    .put(protect, authorize('administrator', 'root'), updateCompany)
    .delete(protect, authorize('root'), deleteCompany)


module.exports = router;
