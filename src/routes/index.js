const express = require("express");
const cache = require("node-cache");
require("dotenv").config();

const { logger } = require("../utils/logger");
const shops = require("./shops");
const strapiHook = require("./strapiHook");

const { verifyKey } = require("../helpers/verifyKey");

const cacheService = new cache({ stdTTL: 0, checkperiod: 0 });
const app = express.Router();

app.use((req, res, next) => {
  req.client = cacheService;
  res.status(200);
  return next();
});

app.use(verifyKey);
app.use("/shops", shops);
app.use("/strapiHook",strapiHook);

app.use("*", (req, res) => {
  logger.warn(`No route found - ${req.url}`);
  res.status(400);
  res.send("No route found");
});

//shut redisclient when app is closed
process.on("SIGTERM", () => {
  if (redisClient) {
    redisClient.flushall((err, _) => {
      if (!err) {
        logger.info("Redis data flushed, when service is closed");
      }
    });
    // redisClient.quit();
  }
});

module.exports = app;
