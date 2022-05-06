const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

exports.createExpressApp = () => {
  const app = express();
  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  return app;
};
