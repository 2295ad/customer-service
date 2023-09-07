const express = require("express");
const cache = require("node-cache");
require("dotenv").config();

const { logger } = require("../utils/logger");
const shops = require("./shops");
const cart = require("./cart");
const order = require("./order");

const strapiHook = require("./strapiHook");
const {jwtVerify} = require('../helpers/jwtVerify');


const cacheService = new cache({ stdTTL: 0, checkperiod: 0 });
const app = express.Router();

app.use((req, res, next) => {
  req.client = cacheService;
  res.status(200);
  return next();
});

app.use("/shops", shops);
app.use("/strapiHook",strapiHook);
//jwt verify
// app.use(jwtVerify);
app.use("/cart",cart);
app.use("/orders",order);

app.use("*", (req, res) => {
  logger.warn(`No route found - ${req.url}`);
  res.status(400);
  res.send("No route found");
});



module.exports = app;
