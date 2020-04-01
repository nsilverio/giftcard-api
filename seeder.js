const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Merchant = require('./models/Merchant');
const Category = require('./models/Category');
const Company = require('./models/Company');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Read JSON files
const merchants = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/merchants.json`, 'utf-8')
);
const categories = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/categories.json`, 'utf-8')
);
const companies = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/companies.json`, 'utf-8')
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);


// Import into DB
const importData = async () => {
    try {
        await Category.create(categories);
        await Merchant.create(merchants);
        await Company.create(companies);
        await User.create(users);

        console.log('Data Imported...'.green.inverse);

        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Merchant.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();
        await Company.deleteMany();

        console.log('Data deleted...'.red.inverse);

        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}