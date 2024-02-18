const express = require("express");
const authRouter = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/me", protect, getMe);
authRouter.put("/updatedetails", protect, updateDetails);
authRouter.put("/updatepassword", protect, updatePassword);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.put("/resetpassword/:resettoken", resetPassword);

module.exports = authRouter;
