const express = require("express");
require("dotenv").config();

const { fetchLatestShops } = require("../controllers/strapiHook");

const route = express.Router();

route.get("/shops", fetchLatestShops);

module.exports = route;
