const { StatusCodes } = require("http-status-codes")
const ErrorHandler = require("../middleware/ErrorHandler")
const Offer = require('../model/OfferSchems')
const fs = require('fs')
const path = require('path')

exports.Addoffer = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorHandler("File is required", StatusCodes.BAD_REQUEST));
        }

        const offerschema = await Offer.create({ offercardImage: req.file.filename });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            code: StatusCodes.CREATED,
            message: "Offer added successfully",
            data: offerschema
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

exports.Updateoffer = async (req, res, next) => {
    try {
        const { offerid } = req.body
        if (!offerid) {
            return next(new ErrorHandler("offerid is required", StatusCodes.BAD_REQUEST));
        }
        const offerschema = await Offer.findById(offerid);
        if (!offerschema) {
            return next(new ErrorHandler("offers not found", StatusCodes.NOT_FOUND));
        }

        if (req.file) {
            if (offerschema.offercardImage) {
                if (Array.isArray(offerschema.offercardImage)) {
                    offerschema.offercardImage.forEach(img => {
                        const imgPath = path.join(__dirname, '..', 'assets', img);
                        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                    });
                } else {
                    const imgPath = path.join(__dirname, '..', 'assets', offerschema.offercardImage);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                }
            }
            offerschema.offercardImage = req.file.filename;
        }
        const updatedoffer = await offerschema.save();
        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Category updated successfully",
            data: updatedoffer
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

exports.Deleteoffer = async (req, res, next) => {
    try {
        const { offerid } = req.params;

        if (!offerid) {
            return next(new ErrorHandler("Offer ID is required", StatusCodes.BAD_REQUEST));
        }

        const offer = await Offer.findById(offerid);
        if (!offer) {
            return next(new ErrorHandler("Offer not found", StatusCodes.NOT_FOUND));
        }

        if (offer.offercardImage) {
            const imagePath = path.join(__dirname, "..", "assets", offer.offercardImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Offer.findByIdAndDelete(offerid);

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Offer removed successfully",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

exports.Fetchoffer = async (req, res, next) => {
    try {
        const offers = await Offer.find();
        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Offers fetched successfully",
            data: offers
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

exports.usersideoffer = async (req, res, next) => {
    try {
        const offers = await Offer.find();
        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Offers fetched successfully",
            data: offers
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}