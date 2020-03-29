const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db')

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const merchants = require('./routes/merchants')

// Initialize express instance
const app = express();

// Logts to console when on dev enviroment
if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'))

// Mount routers
app.use('/api/v1/merchants', merchants);

const PORT = process.env.PORT || 7000

const server = app.listen(PORT, 
    console.log(`Server rinning in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)

    // Close server & exit process
    server.close(() => process.exit(1))
    
})
