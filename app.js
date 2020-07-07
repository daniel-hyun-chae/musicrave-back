const path = require("path");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const app = express();

// development logging with morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// allow cors for development server
app.use(cors());
app.options("*", cors());

// app security
app.use(helmet());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Limit requests from same IP
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// public path for frontend
app.use(express.static(path.join(__dirname, "build")));

const authController = require("./controllers/auth");
app.use("/auth", authController);

const profileController = require("./controllers/profile");
app.use("/api/profile", profileController);

const searchController = require("./controllers/search");
app.use("/api/search", searchController);

module.exports = app;
