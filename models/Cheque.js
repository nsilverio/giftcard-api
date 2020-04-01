const mongoose = require('mongoose');

const ChequeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Cheque', ChequeSchema);