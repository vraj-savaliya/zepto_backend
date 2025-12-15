const { StatusCodes } = require("http-status-codes")
const ErrorHandler = require("../middleware/ErrorHandler")
const Categorysechema = require('../model/Categoryschema')
const CoofeeLovers = require('../model/FoodCarouselSchema')
const fs = require('fs')
const path = require('path')

exports.AddFoodCarousel = async (req, res, next) => {
    try {
        const { Title, description, categoryid } = req.body
        if (!categoryid) {
            return next(new ErrorHandler("categoryid is required", StatusCodes.BAD_REQUEST))
        }
        const categoryschema = await Categorysechema.findById(categoryid)
        if (!categoryschema) {
            return next(new ErrorHandler("category not found", StatusCodes.BAD_REQUEST))
        }
        const coffeeschema = await CoofeeLovers.create({ Title, description, categoryid })
        return res.status(StatusCodes.CREATED).json({
            success: true,
            code: StatusCodes.CREATED,
            message: "Food Add successfully",
            data: coffeeschema
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.FetchFoodCarousel = async (req, res, next) => {
    try {
        const coffeeschema = await CoofeeLovers.find().select('Title description categoryid').populate()

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: coffeeschema
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.DeletFoodCarousel = async (req, res, next) => {
    try {
        const { coffeeid } = req.params

        if (!coffeeid) {
            return next(new ErrorHandler("coffeeid is requried", StatusCodes.BAD_REQUEST))
        }

        const coffeeschema = await CoofeeLovers.findByIdAndDelete(coffeeid)
        if (!coffeeschema) {
            return next(new ErrorHandler("coffee not found", StatusCodes.NOT_FOUND))
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "coffee remove Successfully",
            data: coffeeschema
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))

    }
}

exports.UpdatFoodCarousel = async (req, res, next) => {
    try {
        const { coffeeid, Title, description, categoryid } = req.body

        if (!coffeeid) {
            return next(new ErrorHandler("coffeeid is required", StatusCodes.BAD_REQUEST));
        }

        const coffeeschema = await CoofeeLovers.findById(coffeeid);

        if (!coffeeschema) {
            return next(new ErrorHandler("Food not found", StatusCodes.NOT_FOUND));
        }

        if (Title) {
            coffeeschema.Title = Title;
        }
        if (description) {
            coffeeschema.description = description;
        }
        if (categoryid) {
            coffeeschema.categoryid = categoryid;
        }

        const updatedcoffee = await coffeeschema.save();
        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Details updated successfully",
            data: updatedcoffee
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchusersidefoodcarousel = async (req, res, next) => {
    try {
        const coffeeschema = await CoofeeLovers.find()

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: coffeeschema
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

