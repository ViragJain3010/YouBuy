const express = require("express");
const routes = express.Router();

const {
  addToCart,
  fetchCartItemsByUserId,
  updateCart,
  deleteItemFromCart,
} = require("../controller/CartController");

routes
  .post("/", addToCart)
  .get("/", fetchCartItemsByUserId)
  .patch("/:cartId", updateCart)
  .delete("/:cartId", deleteItemFromCart);

exports.routes = routes;
