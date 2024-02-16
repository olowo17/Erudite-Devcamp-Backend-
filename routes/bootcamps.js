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

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults')

//include other resource routers
const courseRouter = require("./courses");
//Re-route into other resource router
//  @route GET/api/v1/bootcamps/:bootcampId/courses
bootcampRouter.use("/:bootcampId/courses", courseRouter);

bootcampRouter.route("/")
.get(advancedResults(Bootcamp,'courses'),getBootcamps)
.post(createBootcamp);

bootcampRouter
  .route("/:id")
  .get(getBootcampById)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

bootcampRouter.route("/:id/photo").put(bootcampPhotoUpload);

module.exports = bootcampRouter;
