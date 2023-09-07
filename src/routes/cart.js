const express = require("express");
require("dotenv").config();

const { updateCart,fetchCart  } = require("../controllers/cart");

const route = express.Router();

route.get("/fetch", fetchCart);
route.post("/", updateCart);

module.exports = route;
