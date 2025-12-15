const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
    product_Name: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_Image: {
        type: [],
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_discount_price: {
        type: Number,
        required: true
    },
    product_wieght: {
        type: String,
        required: true
    },
    product_Brand: {
        type: String,
        required: true
    },
    categoryid: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Product', Product)