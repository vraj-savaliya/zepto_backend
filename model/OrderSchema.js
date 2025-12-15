const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Order = new Schema({
    customer_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: {
            street: String,
            area: String,
        },
        required: true,
    },
    pincode: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        enum: ["Pending", "Accepted", "Cancel", "Deliverd"],
        required: true,
        default: 'Pending',
    },
    rider_name: {
        type: String,
        required: false
    },
    totalAmount: {
        type: String,
        required: true
    },
    items: [{
        name: String,
        qty: Number,
        price: Number,
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Userschema'
    },
}, { timestamps: true })

module.exports = mongoose.model('Order', Order)