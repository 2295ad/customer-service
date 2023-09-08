const express = require("express");
require("dotenv").config();

const { updateCart,fetchCart,deleteCart  } = require("../controllers/cart");

const route = express.Router();

route.get("/fetch", fetchCart);
route.post("/", updateCart);
route.delete("/",deleteCart);

module.exports = route;
