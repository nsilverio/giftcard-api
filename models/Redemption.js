const mongoose = require('mongoose')
const RandExp = require('randexp');


const RedemptionSchema = new mongoose.Schema({
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



// Static method to get wallet balance
RedemptionSchema.statics.getWalletBalance = async function (userId) {
    console.log('Calculating wallet balance'.blue)

    const obj = await this.aggregate([
        {
            $match: { user: userId }
        },
        {
            $group: {
                _id: '$user',
                walletBalance: { $sum: '$amount' }
            }
        }
    ])

    try {
        await this.model('User').findByIdAndUpdate(
            userId,
            obj[0]
                ? {
                    walletBalance: Math.round((obj[0].walletBalance + Number.EPSILON) * 100) / 100
                }
                : { walletBalance: undefined }
        );


    } catch (err) {
        console.error(err);
    }

}

// Call getWalletBalance after save
RedemptionSchema.post('save', async function () {
    await this.constructor.getWalletBalance(this.user)

})

// Call getWalletBalance after remove
RedemptionSchema.post('remove', async function () {
    await this.constructor.getWalletBalance(this.user)

})

RedemptionSchema.pre('save', function (next) {
    // Set expiration date to one year from the date the redemption 
    const addYear = new Date();
    addYear.setFullYear(addYear.getFullYear() + 1)
    this.expireAt = addYear
    next();
});


RedemptionSchema.pre('save', function (next) {
    // generate giftcard code
    this.code = new RandExp(/([A-Z0-9]{4})-([A-Z0-9]{6})-([A-Z0-9]{4})/).gen()
    next();
});

module.exports = mongoose.model('Redemption', RedemptionSchema);