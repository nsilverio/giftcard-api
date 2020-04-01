const mongoose = require('mongoose');
const slugify = require('slugify')

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    currency: {
        type: [String],
        required: true,
        enum: [
            'GBP',
            'EUR',
            'USD'
        ],
        default: 'GBP'
    },
    slug: String,
    photo: {
        type: String,
        default: 'no-photo.png'
    }
}, {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
// Create comany slug for the name
CompanySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// reverse populate with virtuals

CompanySchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'company',
    justOne: false
})


module.exports = mongoose.model('Company', CompanySchema);