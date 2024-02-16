const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Course = require("./models/Course");
// const User = require("./models/User");
// const Review = require("./models/Review");

//connect to database
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
};

// Read JSON files
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
// );

// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
// );


// Import into DB
const importData = async () => {
    try {
      await Course.create(courses);
    //   await User.create(users);
    //   await Review.create(reviews);
      console.log('Data Imported...'.green.inverse);
      process.exit();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete data
const deleteData = async () => {
    try {
      await Course.deleteMany();
    //   await User.deleteMany();
    //   await Review.deleteMany();
      console.log('Data Destroyed...'.red.inverse);
      process.exit();
    } catch (err) {
      console.error(err);
    }
  };

  if (process.argv[2] === '-i') {
    importData();
  } else if (process.argv[2] === '-d') {
    deleteData();
  }