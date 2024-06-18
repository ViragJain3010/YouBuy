const express = require("express");
const routes = express.Router();

const { fetchAllBrands, createBrand } = require("../controller/BrandsController");

routes.get("/", fetchAllBrands).post("/",createBrand);
exports.routes = routes;
