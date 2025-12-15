const { StatusCodes } = require("http-status-codes")
const ErrorHandler = require("../middleware/ErrorHandler")
const Categorysechema = require('../model/Categoryschema')
const Product = require('../model/ProductSchema')
const fs = require('fs')
const path = require('path')

exports.AddProductdetails = async (req, res, next) => {
    try {
        const { product_Name, product_description, product_price, product_discount_price, product_wieght, product_Brand, categoryid } = req.body

        if (!categoryid) {
            return next(new ErrorHandler("categoryid is required", StatusCodes.BAD_REQUEST))
        }

        const categoryschema = await Categorysechema.findById(categoryid)
        if (!categoryschema) {
            return next(new ErrorHandler("category not found", StatusCodes.BAD_REQUEST))
        }
        const product = await Product.create({ product_Name, product_description, product_price, product_discount_price, product_wieght, product_Brand, categoryid, product_Image: req.files.map(item => item.filename) })
        return res.status(StatusCodes.CREATED).json({
            success: true,
            code: StatusCodes.CREATED,
            message: "Product Added successfully",
            data: product
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.FetchProductdetails = async (req, res, next) => {
    try {
        const product = await Product.find().select('product_Name product_description product_price product_discount_price product_wieght product_Brand product_Image').populate('categoryid', 'category_Name')

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.DeleteProductdetails = async (req, res, next) => {
    try {
        const { productid } = req.params

        if (!productid) {
            return next(new ErrorHandler("productid is requried", StatusCodes.BAD_REQUEST))
        }

        const product = await Product.findById(productid)
        if (!product) {
            return next(new ErrorHandler("product not found", StatusCodes.NOT_FOUND))
        }

        if (product.product_Image && Array.isArray(product.product_Image)) {
            product.product_Image.forEach((imageName) => {
                const imagePath = path.join(__dirname, '..', 'assets', imageName);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }
        await Product.findByIdAndDelete(productid)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "User remove Successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))

    }
}

exports.UpdateProductdetails = async (req, res, next) => {
    try {
        const { productid, product_Name, product_description, product_price, product_discount_price, product_wieght, product_Brand, categoryid } = req.body

        if (!productid) {
            return next(new ErrorHandler("productid is required", StatusCodes.BAD_REQUEST));
        }

        const product = await Product.findById(productid);

        if (!product) {
            return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
        }

        if (req.file) {
            if (product.product_Image) {
                if (Array.isArray(product.product_Image)) {
                    product.product_Image.forEach(img => {
                        const imgPath = path.join(__dirname, '..', 'assets', img);
                        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                    });
                } else {
                    const imgPath = path.join(__dirname, '..', 'assets', product.product_Image);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                }
            }
            product.product_Image = req.file.filename; // store new one
        }
        if (product_Name) {
            product.product_Name = product_Name;
        }
        if (product_description) {
            product.product_description = product_description;
        }
        if (product_price) {
            product.product_price = product_price;
        }
        if (product_discount_price) {
            product.product_discount_price = product_discount_price;
        }
        if (product_wieght) {
            product.product_wieght = product_wieght;
        }
        if (product_Brand) {
            product.product_Brand = product_Brand;
        }
        if (categoryid) {
            product.categoryid = categoryid;
        }
        const updatedproduct = await product.save();
        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Category updated successfully",
            data: updatedproduct
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchusersideproduct = async (req, res, next) => {
    try {
        const { categoryid } = req.query

        let filterData = {}

        if (categoryid && categoryid != "") {
            filterData.categoryid = categoryid
        }

        const product = await Product.find(filterData)
            .select('product_Name product_description product_price product_discount_price product_wieght product_Brand product_Image')
            .populate('categoryid', 'category_Name')
            .limit(15)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchapiforcoffeecarousel = async (req, res, next) => {
    try {
        const { categoryid } = req.query

        let filterData = {}

        if (categoryid && categoryid != "") {
            filterData.categoryid = categoryid
        }

        const product = await Product.find(filterData)
            .select('product_Name product_description product_price product_discount_price product_wieght product_Brand product_Image')
            .populate('categoryid', 'category_Name')
            .limit(10)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchapiforfashion = async (req, res, next) => {
    try {

        const product = await Product.find({ categoryid: '68afe94f886f845743025f40' }).populate('categoryid', 'category_Name').limit(10)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchapiformobile = async (req, res, next) => {
    try {

        const product = await Product.find({ categoryid: '68afe92f886f845743025f3a' }).populate('categoryid', 'category_Name').limit(10)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchapiforbeauty = async (req, res, next) => {
    try {

        const product = await Product.find({ categoryid: '68afe940886f845743025f3d' }).populate('categoryid', 'category_Name').limit(10)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchapiforfresh = async (req, res, next) => {
    try {

        const product = await Product.find({ categoryid: '68afe90b886f845743025f34' }).populate('categoryid', 'category_Name').limit(9)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchapiforcafe = async (req, res, next) => {
    try {

        const product = await Product.find({ categoryid: '68afe8d4886f845743025f2b' }).populate('categoryid', 'category_Name').limit(9)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchapiforbabystore = async (req, res, next) => {
    try {

        const product = await Product.find({ categoryid: '68afe96c886f845743025f46' }).populate('categoryid', 'category_Name').limit(9)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchapiforhome = async (req, res, next) => {
    try {

        const product = await Product.find({ categoryid: '68afe8ec886f845743025f2e' }).populate('categoryid', 'category_Name').limit(9)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

exports.fetchapiforelectronics = async (req, res, next) => {
    try {

        const product = await Product.find({ categoryid: '68afe91a886f845743025f37' }).populate('categoryid', 'category_Name').limit(10)

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Post fetch successfully",
            data: product
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

//ProductMaster
exports.ProductMaster = async (req, res, next) => {
    try {
        const { categoryid } = req.params

        if (!categoryid) {
            return next(new ErrorHandler("categoryid is requried", StatusCodes.BAD_REQUEST))
        }

        const Product_find = await Product.find({ categoryid })

        return res.status(StatusCodes.OK).json({
            success: true,
            code: StatusCodes.OK,
            message: "Product fetch successfully",
            data: Product_find
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}