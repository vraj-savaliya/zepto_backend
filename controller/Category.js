const { StatusCodes } = require("http-status-codes")
const ErrorHandler = require("../middleware/ErrorHandler")
const Categorysechema = require('../model/Categoryschema')
const fs = require('fs')
const path = require('path')
const Categoryschema = require("../model/Categoryschema")

exports.AddCategory = async (req, res, next) => {
    try {
        const { category_Name } = req.body
        const category_Image = req.file

        console.log(req.body);

        const categorysechema = await Categorysechema.create({ category_Name, category_Image: category_Image.filename })

        return res.status(StatusCodes.CREATED).json({
            success: true,
            code: StatusCodes.CREATED,
            message: "Category Add successfully",
            data: categorysechema
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.Updatecategory = async (req, res, next) => {
    try {
        const { category_Name, categoryid } = req.body;
        if (!categoryid) {
            return next(new ErrorHandler("categoryid is required", StatusCodes.BAD_REQUEST));
        }
        const categoryschema = await Categorysechema.findById(categoryid);
        if (!categoryschema) {
            return next(new ErrorHandler("category not found", StatusCodes.NOT_FOUND));
        }
        if (req.file) {
            if (categoryschema.category_Image) {
                if (Array.isArray(categoryschema.category_Image)) {
                    categoryschema.category_Image.forEach(img => {
                        const imgPath = path.join(__dirname, '..', 'assets', img);
                        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                    });
                } else {
                    const imgPath = path.join(__dirname, '..', 'assets', categoryschema.category_Image);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                }
            }
            categoryschema.category_Image = req.file.filename;
        }
        if (category_Name) {
            categoryschema.category_Name = category_Name;
        }
        const updatedCategory = await categoryschema.save();
        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Category updated successfully",
            data: updatedCategory
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

exports.DeleteCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params;

        if (!categoryid) {
            return next(new ErrorHandler("categoryid is required", StatusCodes.BAD_REQUEST));
        }

        // ✅ Find the category by ID
        const category = await Categoryschema.findById(categoryid);
        if (!category) {
            return next(new ErrorHandler("Category not found", StatusCodes.NOT_FOUND));
        }

        if (category.category_Image) {
            const imagePath = path.join(__dirname, '..', 'assets', category.category_Image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Categoryschema.findByIdAndDelete(categoryid);

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Category removed successfully",
            data: category
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

exports.FetchCategory = async (req, res, next) => {
    try {

        const categoryschema = await Categorysechema.find()

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "category Fetch Successfully",
            data: categoryschema
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

exports.getapiforprintcategory = async (req, res, next) => {
    try {
        const categoryschema = await Categorysechema.find()

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Details Fetch Successfully!",
            data: categoryschema
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
}