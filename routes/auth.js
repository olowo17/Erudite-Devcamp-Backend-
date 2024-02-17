const express = require("express");
const authRouter = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", protect, getMe);
authRouter.post("/forgotpassword", forgotPassword);

module.exports = authRouter;
