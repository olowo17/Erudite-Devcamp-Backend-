const express = require("express");
const adminRouter = express.Router();
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/admin");

const User = require("../models/User");

const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

adminRouter.use(protect).use(authorize("admin"));

adminRouter.route("/").get(advancedResults(User), getUsers).post(createUser);

adminRouter.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = adminRouter;
