const mongoose = require('mongoose');

const RedeemSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    code: {
        type: String,
        required: [true, 'Please add a code'],
        unique: true
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
    merchant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Merchant',
        required: true
    },
    removedFromWallet: {
        type: Boolean,
        default: false
    },

});


module.exports = mongoose.model('Redeem', RedeemSchema);