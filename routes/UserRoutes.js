const express = require("express");
const routes = express.Router();

const {
  fetchLoggedInUserData,
  createLoggedInUserData,
  updateLoggedInUserData,
} = require("../controller/UserController");

routes
  .get("/", fetchLoggedInUserData)
  // .post("/", createLoggedInUserData)
  .patch("/", updateLoggedInUserData);

exports.routes = routes;
