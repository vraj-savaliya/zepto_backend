const mongoose = require('mongoose')

const Schema = mongoose.Schema

const WalletSchema = new Schema({
    orderid: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Userschema'
    }
}, { timestamps: true })

module.exports = mongoose.model('WalletSchema', WalletSchema)