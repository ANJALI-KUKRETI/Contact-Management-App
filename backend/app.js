const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const userRouter = require("./routes/userRoutes");
const contactRouter = require("./routes/contactRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

app.use(express.json());

app.use(mongoSanitize());

app.use(xss());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/contacts", contactRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
