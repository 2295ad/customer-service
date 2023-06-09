const express = require("express");
require("dotenv").config();

const { getShopProducts, getAllShops } = require("../controllers/shops");

const route = express.Router();

route.get("/getShop/:id", getShopProducts);
route.get("/fetchList", getAllShops);

module.exports = route;
