const mongoose = require('mongoose');

const ChequeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
});


module.exports = mongoose.model('Cheque', ChequeSchema);