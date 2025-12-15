const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Offer = new Schema({
    offercardImage: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Offer', Offer)