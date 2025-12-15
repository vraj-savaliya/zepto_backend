const express = require('express')
const { AddCategory, Updatecategory, DeleteCategory, FetchCategory } = require('../controller/Category')
const multerUpload = require('../middleware/MulterUpload')
const { AddProductdetails, FetchProductdetails, DeleteProductdetails, UpdateProductdetails } = require('../controller/Product')
const { AddBanners, UpdateBanner, DeleteBanner, FetchBanners } = require('../controller/Banners')
const { Addoffer, Updateoffer, Deleteoffer, Fetchoffer } = require('../controller/Offer')
const { Adduserdetails, Updateuserdetails, Deleteuserdetails, FetchuserCategory, SendOtp, ResendSendOtp } = require('../controller/User')
const { AddFoodCarousel, FetchFoodCarousel, DeletFoodCarousel, UpdatFoodCarousel } = require('../controller/foodcarousl')
const router = express.Router()

//category
router.post('/admin/add/categorydetails', multerUpload().single('category_Image'), AddCategory)
router.put('/admin/update/categorydetails', multerUpload().single('category_Image'), Updatecategory)
router.delete('/admin/delete/categorydetails/:categoryid', DeleteCategory)
router.get('/admin/fetch/categorydetails', FetchCategory)

// ---------------------------------------------------------------------------------------------------------------

//Product
router.post('/admin/add/productdetail', multerUpload().array('product_Image', 10), AddProductdetails)
router.get('/admin/fetch/productdetail', FetchProductdetails)
router.delete('/admin/delete/productdetail/:productid', DeleteProductdetails)
router.put('/admin/update/productdetail', multerUpload().single('product_Image'), UpdateProductdetails)

// ---------------------------------------------------------------------------------------------------------------

//Banner
router.post('/admin/add/banner', multerUpload().array('Banner_Images', 5), AddBanners)
router.put('/admin/update/banner', multerUpload().single('Banner_Images'), UpdateBanner)
router.delete('/admin/delete/bannerdetails/:bannerid', DeleteBanner)
router.get('/admin/fetch/bannerdetails', FetchBanners)


// ---------------------------------------------------------------------------------------------------------------

//Offer
router.post('/admin/add/offer', multerUpload().single('offercardImage'), Addoffer)
router.put('/admin/update/offer', multerUpload().single('offercardImage'), Updateoffer)
router.delete('/admin/delete/offer/:offerid', Deleteoffer)
router.get('/admin/fetch/offer', Fetchoffer)

// ---------------------------------------------------------------------------------------------------------------

//food zone
router.post('/admin/add/food', multerUpload().none(), AddFoodCarousel)
router.get('/admin/fetch/food', FetchFoodCarousel)
router.delete('/admin/delete/food/:coffeeid', DeletFoodCarousel)
router.put('/admin/update/food', multerUpload().none(), UpdatFoodCarousel)


module.exports = router;