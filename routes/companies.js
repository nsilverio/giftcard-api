const express = require('express')

const {
    getCompanies,
    deleteCompany
} = require('../controllers/companies')

// Include other resource routers 
const userRouter = require('./users')

const router = express.Router()

// Re-route into another resources routers
router.use('/:companyId/users', userRouter)

router
    .route('/')
    .get(getCompanies)

router
    .route('/:id')
    .delete(deleteCompany)

module.exports = router;
