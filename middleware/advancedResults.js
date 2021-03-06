const advancedResults = (model, populate) => async (req, res, next) => {

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']


    /* validates if model requires domain / user validation (Merchant)
    // 
    if(collection.collectionName !== '')
    */
    // adds userID to queryString
    if (req.params.userId) {
        reqQuery.user = req.params.userId
    }
    // adds companyId to queryString
    reqQuery.company = req.user.company


    // Create query string
    let queryString = JSON.stringify(reqQuery)
    queryString.user = req.params.userId

    // Loop over removeFields and delete them from the reqQuery
    removeFields.forEach(param => delete reqQuery[param])


    // Create operators ($gt, $gte etc)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // Finding resources
    let query = model.find(JSON.parse(queryString))

    // Select fields
    if (req.query.select) {
        // replace , by space
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    //Sort
    if (req.query.sort) {
        // replace , by space
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)

    } else {
        query = query.sort('name') // - desc 
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 8
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // populate as per parameter
    if (populate) {
        query.populate(populate)
    }

    // Executing query
    const results = await query
    console.log(results)

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    res.advancedResults = {
        success: true,
        count: results.lenght,
        pagination,
        data: results
    }

    next()

}

module.exports = advancedResults
