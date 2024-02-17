const express = require("express");
const courseRouter = express.Router({ mergeParams: true });
const {
  getCourseById,
  getCourses,
  updateCourse,
  deleteCourse,
  createCourse,
} = require("../controllers/courses");
const { protect, authorize } = require("../middleware/auth");

const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

courseRouter
  .route("/")
  .get(
    advancedResults(
      Course,
      {
        path: "bootcamp",
        select: "name description",
      },
    ),
    getCourses
  )
  .post(protect, authorize("admin", "publisher"), createCourse);

courseRouter
  .route("/:id")
  .get(getCourseById)
  .put(protect, authorize("admin", "publisher"), updateCourse)
  .delete(protect, authorize("admin", "publisher"), deleteCourse);

module.exports = courseRouter;
