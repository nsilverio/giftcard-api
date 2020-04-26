const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

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
        enum: ['user', 'administrator', 'root'],
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
    accountBalance: Number,
    walletBalance: Number,
    photo: {
        type: String,
        default: 'user-no-photo.png'
    },
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

UserSchema.virtual('redemptions', {
    ref: 'Redemption',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

//Encrypt password using bcryptjs
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
// Sign JWT and return 
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}
// Match user entered password to hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token    
UserSchema.methods.getResetPasswordToken = function () {
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update('resetToken')
        .digest('hex')

    //Set expire to 10 minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}
module.exports = mongoose.model('User', UserSchema);
