const express = require('express')

const {
    getCompanies
} = require('../controllers/companies')

// Include other resource routers 
const userRouter = require('./users')

const router = express.Router()

// Re-route into another resources routers
router.use('/:companyId/users', userRouter)

router
    .route('/')
    .get(getCompanies)

module.exports = router;
