const express = require('express')
const multerUpload = require('../middleware/MulterUpload')
const { getapiforprintcategory } = require('../controller/Category')
const { Adduserdetails, Updateuserdetails, Deleteuserdetails, FetchuserCategory, SendOtp, ResendSendOtp, VerifyedOtp, GetUserDetails, UserUpdate, Fetchuserdetails } = require('../controller/User')
const { usersidefetchapibanner } = require('../controller/Banners')
const { fetchusersidefoodcarousel } = require('../controller/foodcarousl')
const { usersideoffer } = require('../controller/Offer')
const { fetchusersideproduct, fetchapiforcoffeecarousel, fetchapiforfashion, fetchapiformobile, fetchapiforbeauty, fetchapiforfresh, fetchapiforcafe, fetchapiforbabystore, fetchapiforhome, fetchapiforelectronics, ProductMaster } = require('../controller/Product')
const { CraetePayment, VerifyPayment } = require('../controller/Wallet')
const { AddOrderdetails } = require('../controller/Order')
const router = express.Router()

//user
router.post('/add/userdetails', multerUpload().none(), Adduserdetails)
router.put('/update/userdetails', multerUpload().none(), Updateuserdetails)
router.delete('/delete/userdetails/:userid', Deleteuserdetails)
router.get('/fetch/userdetails/:userid', Fetchuserdetails)

// ------------------------------------------------------------------------------------------------------------------

//otp
router.post('/user/send/otp', SendOtp)
router.post('/user/verify/otp', VerifyedOtp)
router.post('/resend/otp', ResendSendOtp)

// ------------------------------------------------------------------------------------------------------------------

router.get('/userdetailsin/profile/:userid', GetUserDetails)
router.put('/update/name/email/profile', UserUpdate)

// ------------------------------------------------------------------------------------------------------------------

// get api for user
router.get('/fetchcategory/details/page', getapiforprintcategory) // complete
router.get('/fetchbanner/details/page', usersidefetchapibanner) // complete
router.get('/fetchfoodcarousel/details/page', fetchusersidefoodcarousel)    
router.get('/fetchoffer/details/page', usersideoffer) //complete
router.get('/fetchproduct/details/page', fetchusersideproduct)
router.get('/fetchproduct/details/page/coffee', fetchapiforcoffeecarousel) //complete
router.get('/fetchproduct/details/page/for/all/page/fashion', fetchapiforfashion) //complete
router.get('/fetchproduct/details/page/for/all/page/mobile', fetchapiformobile) //complete
router.get('/fetchproduct/details/page/for/all/page/beauty', fetchapiforbeauty) //complete
router.get('/fetchproduct/details/page/for/all/page/fresh', fetchapiforfresh) //complete
router.get('/fetchproduct/details/page/for/all/page/cafe', fetchapiforcafe) //complete
router.get('/fetchproduct/details/page/for/all/page/babystore', fetchapiforbabystore) //complete
router.get('/fetchproduct/details/page/for/all/page/home', fetchapiforhome) //complete
router.get('/fetchproduct/details/page/for/all/page/electronics', fetchapiforelectronics) //complete

//Masterapi
router.get('/fetchproduct/details/page/for/show/categorywise/products/:categoryid', ProductMaster) //complete


//Payment
router.post('/user/add/amount', CraetePayment)
router.post('/user/verify/payment', VerifyPayment)

//Add Order
router.post('/add/order', AddOrderdetails)

module.exports = router;