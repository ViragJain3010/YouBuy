const express = require("express");
const routes = express.Router();

const {
  createUser,
  updateUser,
  loginUser,
  checkUser,
  logoutUser,
} = require("../controller/AuthController");
const passport = require("passport");

// all Routes
routes
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check",passport.authenticate("jwt"), checkUser)
  .post("/signup", createUser)
  .patch("/:userId", updateUser)
  .get('/logout', logoutUser)

exports.routes = routes;
