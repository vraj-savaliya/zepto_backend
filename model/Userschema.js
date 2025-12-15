const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Userschema = new Schema({
    user_email: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: false
    },
    user_address: {
        type: {
            street1: String,
            street2: String,
            area: String,
            city: String,
            pincode: Number,
            state: String
        },
        required: true
    },
    user_profile_picture: {
        type: String,
        required: false,
        default: "default-profile.png",
    },
    user_wallet: {
        type: Number,
        required: true
    },
    free_cash: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.models.Userschema || mongoose.model("Userschema", Userschema)