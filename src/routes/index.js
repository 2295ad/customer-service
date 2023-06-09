const express = require("express");

const { logger } = require("../utils/logger");
const shops = require("./shops");

const { verifyKey } = require("../helpers/verifyKey");

const app = express.Router();

app.use((_, res, next) => {
  res.status(200);
  return next();
});

app.use(verifyKey);
app.use("/shops", shops);

app.use("*", (req, res) => {
  logger.warn(`No route found - ${req.url}`);
  res.status(400);
  res.send("No route found");
});

module.exports = app;
