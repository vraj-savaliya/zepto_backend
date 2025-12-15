const { StatusCodes } = require("http-status-codes")
const ErrorHandler = require("../middleware/ErrorHandler")
const fs = require('fs')
const path = require('path')
const userSchema = require('../model/userSchema')
const OrderSchema = require("../model/OrderSchema")

exports.AddOrderdetails = async (req, res, next) => {
    try {
        const { customer_name, email, location, pincode, order_status, rider_name, totalAmount, items, userId } = req.body
        if (!userId || !customer_name || !email || !location || !pincode || !order_status || !rider_name || !totalAmount || !items) {
            return next(new ErrorHandler("All Fields Are Required!", StatusCodes.BAD_REQUEST))
        }
        const user = await userSchema.findById(userId)
        if (!user) {
            return next(new ErrorHandler("Account not Found", StatusCodes.NOT_FOUND))
        }
        if (user.user_wallet >= totalAmount) {
            return next(new ErrorHandler("Insufficient Amount in wallet", StatusCodes.NOT_ACCEPTABLE))
        }
        const order = await OrderSchema.create(customer_name, email, location, pincode, order_status, rider_name, totalAmount, items, userId)

        return res.status(StatusCodes.CREATED).json({
            success: true,
            code: StatusCodes.CREATED,
            message: "Order place successfully",
            data: order
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}