const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'administrator'],
        default: 'user'
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
UserSchema.virtual('cheques', {
    ref: 'Cheque',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

UserSchema.virtual('redeems', {
    ref: 'Redeem',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})
module.exports = mongoose.model('User', UserSchema);
