const mongoose = require('mongoose')
const RandExp = require('randexp');


const RedeemSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    code: {
        type: String,
        unique: true,
        match: [
            /([A-Z0-9]{4})-([A-Z0-9]{6})-([A-Z0-9]{4})/,
            'Please add a valid code'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expireAt: {
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

RedeemSchema.pre('save', function (next) {
    // Set expiration date to one year from the date the redeem 
    const addYear = new Date();
    addYear.setFullYear(addYear.getFullYear() + 1)
    this.expireAt = addYear
    next();
});


RedeemSchema.pre('save', function (next) {
    // generate giftcard code
    this.code = new RandExp(/([A-Z0-9]{4})-([A-Z0-9]{6})-([A-Z0-9]{4})/).gen()
    next();
});

module.exports = mongoose.model('Redeem', RedeemSchema);