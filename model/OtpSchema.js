const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Otp = new Schema({
    otp: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    expiredAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Otp', Otp)