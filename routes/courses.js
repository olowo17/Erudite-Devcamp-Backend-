const express = require("express");
const courseRouter = express.Router({ mergeParams: true });
const {
  getCourseById,
  getCourses,
  updateCourse,
  deleteCourse,
  createCourse,
} = require("../controllers/courses");

const Course = require("../models/Course")
const advancedResults = require("../middleware/advancedResults")

courseRouter.route("/").get(advancedResults(Course,{
  path:'bootcamp',
  select: 'name description'
}),getCourses).post(createCourse);

courseRouter
  .route("/:id")
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = courseRouter;
