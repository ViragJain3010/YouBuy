const express = require("express");
const routes = express.Router();

const {
  createNewProduct,
  fetchProductsByFilter,
  fetchProductById,
  updateProduct,
} = require("../controller/ProductController");
const { isAuth } = require("../common");

// all Routes
routes
  .post("/",isAuth(), createNewProduct)
  .get("/:id", isAuth(), fetchProductById)
  .get("/", fetchProductsByFilter)
  .patch("/:id", isAuth(),  updateProduct);

exports.routes = routes;
