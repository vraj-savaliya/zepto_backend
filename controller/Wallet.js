const { StatusCodes } = require("http-status-codes")
const ErrorHandler = require("../middleware/ErrorHandler")
const WalletSchema = require('../model/WaletSchema')
const Userschema = require('../model/Userschema')
const fs = require('fs')
const path = require('path')
const Razorpay = require('razorpay')

exports.CraetePayment = async (req, res, next) => {
    try {
        const { amount, userId } = req.body

        console.log(req.body);

        const razorpay = new Razorpay({
            key_id: process.env.RAZOERPAY_KEYID,
            key_secret: process.env.RAZOERPAY_KEY_SECRET
        })

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt#${new Date().getTime()}`,
            notes: {
                TestPayment: "Test paymnetGetway"
            }
        })

        if (order) {
            await WalletSchema.create({ orderid: order.id, amount, status: 'Pending', userId })
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Order create successfully",
            data: {
                ...order,
                key_id: process.env.RAZOERPAY_KEYID
            }
        })

    } catch (error) {
        console.log(error);

        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.VerifyPayment = async (req, res, next) => {
    try {
        const { orderId, paymentId } = req.body

        const razorpay = new Razorpay({
            key_id: process.env.RAZOERPAY_KEYID,
            key_secret: process.env.RAZOERPAY_KEY_SECRET
        })

        const response = await razorpay.orders.fetch(orderId)

        console.log(response);

        if (response.status === "paid") {
            const wallet = await WalletSchema.findOneAndUpdate(
                { orderid: orderId },
                { status: "Success", paymentId },
                { new: true }
            );

            if (wallet) {
                await Userschema.findByIdAndUpdate(
                    wallet.userId,
                    { $inc: { user_wallet: wallet.amount } },
                    { new: true }
                );
            }
        }

        if (response) {
            await Userschema.findByIdAndUpdate(
                response.userid,
                { $inc: { user_wallet: response.amount } },
                { new: true }
            );
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Order fetch successfully",
            data: response
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}



// {
//   id: 'order_RNgPNUes9lgWdc',
//   entity: 'order',
//   amount: 10000,
//   amount_paid: 10000,
//   amount_due: 0,
//   currency: 'INR',
//   receipt: 'receipt#1759206909885',
//   offer_id: null,
//   status: 'paid',
//   attempts: 1,
//   notes: { TestPayment: 'Test paymnetGetway' },
//   created_at: 1759206908,
//   description: null,
//   checkout: null
// }