const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const bootcampRouter = require("./routes/bootcamps");
const authRouter = require("./routes/auth");
const courseRouter = require("./routes/courses");
const reviewRouter = require("./routes/reviews");
const adminRouter = require("./routes/admin");
const fileupload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const colors = require("colors");
const cors = require("cors");
// load env variables
dotenv.config({ path: "./config/config.env" });

//connect to Database
connectDB();

const morgan = require("morgan");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(helmet());



app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(hpp());

// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(mongoSanitize());

//File upload
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, `public`)));


// Mount Routers
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server & exit process
  server.close(() => process.exit(1));
});
