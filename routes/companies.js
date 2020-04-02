const express = require('express')

const {
    getCompanies,
    getCompany,
    deleteCompany,
    createCompany,
    updateCompany,
} = require('../controllers/companies')

// Include other resource routers 
const userRouter = require('./users')

const router = express.Router()

// Re-route into another resources routers
router.use('/:companyId/users', userRouter)

router
    .route('/')
    .get(getCompanies)
    .post(createCompany)

router
    .route('/:id')
    .get(getCompany)
    .put(updateCompany)
    .delete(deleteCompany)


module.exports = router;
