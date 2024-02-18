const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and passowrd", 400));
  }

  // Check for user

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credendtials", 401));
  }

  //check if passowrd matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credendtials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// Get current logged in user

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//  log user out and clear cookie

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 100 * 1000),
    httpOnly: true 
  });
  res.status(200).json({
    success: true,
    msg: "user logged out",
  });
});

// Update  user

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const filedsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, filedsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get current logged in user

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// POST Forget me route
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse(`There is no user with the email`, 404));
  }

  const resetToken = user.getResetPasswordToken();

  console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  //create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiveing this email because you have requested the reset of a password.
 Please click on a PUT request the link to reset \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "password reset token",
      message,
    });

    // Respond with success message after sending the email
    res.status(200).json({ success: true, message });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// Reset password

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed password
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model and create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
