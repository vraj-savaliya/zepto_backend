const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Banners = new Schema({
    Banner_Images: {
        type: [],
        required: true
    },
    categoryid: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Banners', Banners)