const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // env 제일 먼저 로드

const app = express();

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false,
};

// 라우터
const indexRouter = require("./routes/index");
const enterpriseRouter = require("./routes/enterPrise");

// 미들웨어
app.use(logger("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 라우팅
app.use("/", indexRouter);
app.use("/api/enterprise", enterpriseRouter);


// tokenScheduler 스케줄러 실행 (토큰 자동 갱신)
// require("./service/Scheduler/tokenScheduler");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 에러 핸들러
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const isDev = req.app.get("env") === "development";

  res.status(status).json({
    message: err.message,
    status,
    ...(isDev && { stack: err.stack }),
  });
});

module.exports = app;
