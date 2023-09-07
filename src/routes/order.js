const express = require("express");
require("dotenv").config();

const { confirmOrder,fetchOrders  } = require("../controllers/order");

const route = express.Router();

route.get("/fetch", fetchOrders);
route.post("/", confirmOrder);

module.exports = route;
