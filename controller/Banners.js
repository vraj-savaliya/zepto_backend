const { StatusCodes } = require("http-status-codes")
const ErrorHandler = require("../middleware/ErrorHandler")
const Categorysechema = require('../model/Categoryschema')
const Banners = require('../model/BannerSchema')
const fs = require('fs')
const path = require('path')

exports.AddBanners = async (req, res, next) => {
    try {
        const { categoryid } = req.body

        if (!categoryid) {
            return next(new ErrorHandler("categoryid is required", StatusCodes.BAD_REQUEST))
        }
        const categoryschema = await Categorysechema.findById(categoryid)
        if (!categoryschema) {
            return next(new ErrorHandler("category not found", StatusCodes.BAD_REQUEST))
        }
        const bannerschema = await Banners.create({ categoryid, Banner_Images: req.files.map(item => item.filename) })
        return res.status(StatusCodes.CREATED).json({
            success: true,
            code: StatusCodes.CREATED,
            message: "Banner Add successfully",
            data: bannerschema
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.UpdateBanner = async (req, res, next) => {
    try {
        const { banner_id, categoryid } = req.body
        const Banner_Images = req.file
        if (!banner_id) {
            return next(new ErrorHandler("bannerid is required", StatusCodes.BAD_REQUEST));
        }

        const banner = await Banners.findById(banner_id);

        if (!banner) {
            return next(new ErrorHandler("banner not found", StatusCodes.NOT_FOUND));
        }

        if (categoryid) {
            banner.categoryid = categoryid;
        }

        if (req.file) {
            if (banner.Banner_Images) {
                if (Array.isArray(banner.Banner_Images)) {
                    banner.Banner_Images.forEach(img => {
                        const imgPath = path.join(__dirname, '..', 'assets', img);
                        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                    });
                } else {
                    const imgPath = path.join(__dirname, '..', 'assets', banner.Banner_Images);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                }
            }
            banner.Banner_Images = req.file.filename;
        }
        const updatedbanner = await banner.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Category updated successfully",
            data: updatedbanner
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.DeleteBanner = async (req, res, next) => {
    try {
        const { bannerid } = req.params;

        if (!bannerid) {
            return next(new ErrorHandler("Banner ID is required", StatusCodes.BAD_REQUEST));
        }

        const banner = await Banners.findById(bannerid);
        if (!banner) {
            return next(new ErrorHandler("Banner not found", StatusCodes.NOT_FOUND));
        }

        if (banner.Banner_Images && Array.isArray(banner.Banner_Images)) {
            banner.Banner_Images.forEach((imageName) => {
                const imagePath = path.join(__dirname, '..', 'assets', imageName);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }
        await Banners.findByIdAndDelete(bannerid);

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Banner removed successfully",
            data: banner
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

exports.FetchBanners = async (req, res, next) => {
    try {
        const banner = await Banners.find().select('Banner_Images').populate('categoryid', 'category_Name')

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: banner
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.usersidefetchapibanner = async (req, res, next) => {
    try {
        const banner = await Banners.find().select('Banner_Images').populate('categoryid', 'category_Name')

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: banner
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}