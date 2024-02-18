const express = require("express");
const bootcampRouter = express.Router();
const {
  getBootcampById,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/auth");

//include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

//Re-route into other resource router
//  @route GET/api/v1/bootcamps/:bootcampId/courses
//  @route GET/api/v1/bootcamps/:bootcampId/reviews
bootcampRouter.use("/:bootcampId/courses", courseRouter);
bootcampRouter.use("/:bootcampId/reviews", reviewRouter);

bootcampRouter
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("admin", "publisher"), createBootcamp);

bootcampRouter
  .route("/:id")
  .get(getBootcampById)
  .put(protect, authorize("admin", "publisher"), updateBootcamp)
  .delete(protect, authorize("admin", "publisher"), deleteBootcamp);

bootcampRouter
  .route("/:id/photo")
  .put(protect, authorize("admin", "publisher"), bootcampPhotoUpload);

module.exports = bootcampRouter;
