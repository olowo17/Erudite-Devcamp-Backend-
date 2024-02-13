const express = require("express");
const bootcampRouter = express.Router();
const {
  getBootcampById,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  postBootcamp,
} = require("../controllers/bootcamps");

bootcampRouter.route("/").get(getBootcamps).post(postBootcamp);

bootcampRouter
  .route("/:id")
  .get(getBootcampById)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = bootcampRouter;
