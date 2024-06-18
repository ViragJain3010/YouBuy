const express = require("express");
const routes = express.Router();

const {
  fetchAllCategory,
  createCategory,
} = require("../controller/CategoryController");

routes.get("/", fetchAllCategory).post("/", createCategory);
exports.routes = routes;
