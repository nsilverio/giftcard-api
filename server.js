const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db')
const colors = require('colors');
const fileUpload = require('express-fileUpload');
const errorHandler = require('./middleware/error')
const path = require('path')

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const companies = require('./routes/companies')
const merchants = require('./routes/merchants')
const users = require('./routes/users')
const cheques = require('./routes/cheques')
const redeems = require('./routes/redeems')

// Initialize express instance
const app = express();

// Body parser
app.use(express.json())

// Logts to console when on dev enviroment
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'))

// File upload 
app.use(fileUpload())
// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routers
app.use('/api/v1/companies', companies)
app.use('/api/v1/merchants', merchants)
app.use('/api/v1/users', users)
app.use('/api/v1/cheques', cheques)
app.use('/api/v1/redeems', redeems)

// error handler 
app.use(errorHandler)

const PORT = process.env.PORT || 7000

const server = app.listen(PORT,
    console.log(`Server rinning in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)

    // Close server & exit process
    server.close(() => process.exit(1))

})
