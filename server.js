const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Route files
const merchants = require('./routes/merchants')

// Load env vars
dotenv.config({ path: './config/config.env' });

// Initialize express instance
const app = express();

// Logts to console when on dev enviroment
if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'))

// Mount routers
app.use('/api/v1/merchants', merchants);

const PORT = process.env.PORT || 7000

app.listen(PORT, 
    console.log(`Server rinning in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

