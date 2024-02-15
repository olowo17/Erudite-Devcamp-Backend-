const express = require("express");
const bootcampRouter = express.Router();
const {
  getBootcampById,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
} = require("../controllers/bootcamps");

bootcampRouter.route("/").get(getBootcamps).post(createBootcamp);

bootcampRouter
  .route("/:id")
  .get(getBootcampById)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = bootcampRouter;
