const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FoodCarouselSchema = new Schema({
    Title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoryid: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('FoodCarouselSchema', FoodCarouselSchema)