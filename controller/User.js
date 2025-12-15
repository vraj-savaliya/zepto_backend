const { StatusCodes } = require("http-status-codes")
const ErrorHandler = require("../middleware/ErrorHandler")
const Userschema = require('../model/Userschema')
const SendEmail = require('../util/EmailService')
const OtpSchema = require('../model/OtpSchema')

// exports.Adduserdetails = async (req, res, next) => {
//   try {
//     const { user_email, user_name, user_address, user_wallet, free_cash } = req.body
//     const user_profile_picture = req.file

//     const userschema = await Userschema.create({ user_email, user_name, user_address: JSON.parse(user_address), user_wallet, free_cash, user_profile_picture: user_profile_picture.filename })

//     return res.status(StatusCodes.CREATED).json({
//       success: true,
//       code: StatusCodes.CREATED,
//       message: "User Add successfully",
//       data: userschema
//     })
//   } catch (error) {

//   }
// }
exports.Adduserdetails = async (req, res, next) => {
  try {
    const { user_email, user_name, user_wallet, free_cash, user_address } = req.body;

    if (!user_email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User email is required"
      });
    }

    // ✅ check if user already exists
    let user = await Userschema.findOne({ user_email });

    if (user) {
      // ✅ update existing user (especially address)
      user.user_address = user_address || user.user_address;
      user.user_name = user_name || user.user_name;
      user.user_wallet = user_wallet ?? user.user_wallet;
      user.free_cash = free_cash ?? user.free_cash;

      await user.save();

      return res.status(StatusCodes.OK).json({
        success: true,
        code: 200,
        message: "User updated successfully",
        data: user
      });
    } else {
      // ✅ if user doesn’t exist → create new
      const newUser = await Userschema.create({
        user_email,
        user_name,
        user_wallet: user_wallet || 0,
        free_cash: free_cash || 0,
        user_address,
      });

      return res.status(StatusCodes.CREATED).json({
        success: true,
        code: 201,
        message: "User created successfully",
        data: newUser
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

exports.Updateuserdetails = async (req, res, next) => {
  try {
    const { user_email, user_name, user_address, user_wallet, free_cash, userid } = req.body
    const user_profile_picture = req.file
    if (!userid) {
      return next(new ErrorHandler("userId is requried", StatusCodes.BAD_REQUEST))
    }
    const user = await Userschema.findById(userid)
    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND))
    }
    if (req.file) {
      if (user.user_profile_picture) {
        fs.unlinkSync(path.join(__dirname, '..', 'assets', user.user_profile_picture))
      }
      user.user_profile_picture = user_profile_picture.filename
    }
    if (user_email) {
      user.user_email = user_email
    }
    if (user_name) {
      user.user_name = user_name
    }
    if (user_address) {
      user.user_address = JSON.parse(user_address)
    }
    if (user_wallet) {
      user.user_wallet = user_wallet
    }
    if (free_cash) {
      user.free_cash = free_cash
    }
    const updateUser = await user.save()
    return res.status(StatusCodes.OK).json({
      success: true,
      code: StatusCodes.OK,
      message: "User Update successfully",
      data: updateUser
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

exports.Deleteuserdetails = async (req, res, next) => {
  try {
    const { userid } = req.params
    if (!userid) {
      return next(new ErrorHandler("userid is requried", StatusCodes.BAD_REQUEST))
    }
    const user = await Userschema.findByIdAndDelete(userid)
    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND))
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      code: StatusCodes.OK,
      message: "User remove Successfully",
      data: user
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

exports.Fetchuserdetails = async (req, res, next) => {
  try {
    const { userid } = req.params
    if (!userid) {
      return next(new ErrorHandler("userid is requried", StatusCodes.BAD_REQUEST))
    }
    const user = await Userschema.findById(userid)
    if (!user) {
      return next(new ErrorHandler("user not found", StatusCodes.NOT_FOUND))
    }
    console.log(user);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      code: StatusCodes.OK,
      message: "user Fetch Successfully",
      data: user
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000);
}

exports.SendOtp = async (req, res, next) => {
  try {
    const { email } = req.body

    console.log(email);

    if (!email) {
      return next(new ErrorHandler('Email is requried', StatusCodes.BAD_REQUEST))
    }

    const otp = await OtpSchema.create({ otp: generateOTP(), email, expiredAt: new Date(Date.now() + 2 * 60 * 1000) })

    await SendEmail({
      to: otp.email,
      subject: "Verify Otp",
      html: `
            <!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f7; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1); overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="background:#4f46e5; padding:20px;">
              <h1 style="margin:0; color:#ffffff; font-size:22px;">🔐 OTP Verification</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px; margin:0 0 20px;">Hi</p>
              <p style="font-size:16px; margin:0 0 20px;">
                Please use the following One-Time Password (OTP) to complete your verification:
              </p>
              
              <!-- OTP Box -->
              <div style="text-align:center; margin:30px 0;">
                <span style="display:inline-block; background:#4f46e5; color:#ffffff; padding:15px 40px; font-size:24px; font-weight:bold; border-radius:8px; letter-spacing:4px;">
                  ${otp.otp}
                </span>
              </div>

              <p style="font-size:14px; margin:0 0 10px; color:#666;">
                This OTP will expire in <strong>2 minutes</strong>. If you did not request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f9fafb; padding:20px; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            `
    })

    return res.status(StatusCodes.OK).json({
      success: true,
      code: StatusCodes.OK,
      message: "Otp Send successfully"
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

exports.VerifyedOtp = async (req, res, next) => {
  try {
    const { otp, email } = req.body

    if (!email || !otp) {
      return next(new ErrorHandler('Otp and Email is requried', StatusCodes.BAD_REQUEST))
    }

    const existOtp = await OtpSchema.findOne({ email, otp, isVerified: false, expiredAt: { $gt: Date.now() } })
    if (!existOtp) {
      return next(new ErrorHandler('Invalid Otp', StatusCodes.UNAUTHORIZED))
    }

    existOtp.isVerified = true
    await existOtp.save()

    let alredyExitsUser = await Userschema.findOne({ user_email: email })
    if (!alredyExitsUser) {
      alredyExitsUser = await Userschema.create({
        user_email: email, free_cash: 50, user_name: "", user_wallet: 0, user_address: {
          street1: "",
          street2: "",
          area: "",
          city: "",
          state: "",
          pincode: 0
        }
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      code: StatusCodes.OK,
      message: "Otp Verified successfully",
      data: alredyExitsUser._id
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

exports.ResendSendOtp = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return next(new ErrorHandler('Email is requried', StatusCodes.BAD_REQUEST))
    }

    await OtpSchema.deleteMany({ email })

    const otp = await OtpSchema.create({ otp: generateOTP(), email, expiredAt: new Date(Date.now() + 2 * 60 * 1000) })

    await SendEmail({
      to: otp.email,
      subject: "Verify Otp",
      html: `
            <!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f7; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1); overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="center" style="background:#4f46e5; padding:20px;">
              <h1 style="margin:0; color:#ffffff; font-size:22px;">🔐 OTP Verification</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px; margin:0 0 20px;">Hi</p>
              <p style="font-size:16px; margin:0 0 20px;">
                Please use the following One-Time Password (OTP) to complete your verification:
              </p>
              
              <!-- OTP Box -->
              <div style="text-align:center; margin:30px 0;">
                <span style="display:inline-block; background:#4f46e5; color:#ffffff; padding:15px 40px; font-size:24px; font-weight:bold; border-radius:8px; letter-spacing:4px;">
                  ${otp.otp}
                </span>
              </div>

              <p style="font-size:14px; margin:0 0 10px; color:#666;">
                This OTP will expire in <strong>2 minutes</strong>. If you did not request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f9fafb; padding:20px; font-size:12px; color:#777;">
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            `
    })

    return res.status(StatusCodes.OK).json({
      success: true,
      code: StatusCodes.OK,
      message: "Otp Send successfully"
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

exports.GetUserDetails = async (req, res, next) => {
  try {
    const { userid } = req.params

    if (!userid) {
      return next(new ErrorHandler("userid is requried", StatusCodes.BAD_REQUEST))
    }

    const user = await Userschema.findById(userid)
    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND))
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      code: StatusCodes.OK,
      message: "User fetch successfully",
      data: user
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

exports.UserUpdate = async (req, res, next) => {
  try {

    const { user_name, user_address, userid } = req.body

    if (!userid) {
      return next(new ErrorHandler("User_id must be required", StatusCodes.BAD_REQUEST))
    }

    const Userfind = await Userschema.findById(userid)

    if (!Userfind) {
      return next(new ErrorHandler("Userfind can not find", StatusCodes.NOT_FOUND))
    }

    Userfind.user_name = user_name || Userfind.user_name
    Userfind.user_address = user_address || Userfind.user_address

    await Userfind.save()

    return res.status(StatusCodes.OK).json({
      success: true,
      code: StatusCodes.OK,
      message: "User updateed successfully"
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}