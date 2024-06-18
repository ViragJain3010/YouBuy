const express = require("express");
const routes = express.Router();

const {
  addOrder,
  fetchAllOrdersByUserId,
  fetchAllOrders,
  updateOrder,
} = require("../controller/OrderController");

routes
  .post("/", addOrder)
  .get("/", fetchAllOrdersByUserId)
  .get("/all", fetchAllOrders)
  .patch("/:orderId", updateOrder);

exports.routes = routes;