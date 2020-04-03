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


// Static method to get account balance for user 
ChequeSchema.statics.getAccountBalance = async function (userId) {
    console.log('Calculating account balance'.blue);
    const obj = await this.aggregate([
        {
            $match: { user: userId }
        },
        {
            $group: {
                _id: '$user',
                accountBalance: { $sum: '$amount' }
            }
        }
    ])

    try {
        await this.model('User').findByIdAndUpdate(userId,
            obj[0]
                ? {
                    accountBalance: obj[0].accountBalance
                }
                : { accountBalance: undefined }
        )
    } catch (error) {

    }

}

// Call accountBalance after save 
ChequeSchema.post('save', function () {
    this.constructor.getAccountBalance(this.user)
})
// Call accountBalance before remove
ChequeSchema.pre('save', function () {
    this.constructor.getAccountBalance(this.user)
})
module.exports = mongoose.model('Cheque', ChequeSchema);