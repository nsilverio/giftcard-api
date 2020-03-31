const mongoose = require('mongoose');
const slugify = require('slugify')


const MerchantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters']
        },
        slug: String,
        photo: {
            type: String,
            default: 'no-photo.png'
        }

    }
)

// Create merchant slug for the name
MerchantSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})


module.exports = mongoose.model('Merchant', MerchantSchema)