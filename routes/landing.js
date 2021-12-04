const express = require("express");
const router = express.Router();
const errorHandler = require("../Errors/errorHandler");
const data = require("../data");
const activity = data.activity;

router.get("/", async (req, res) => {
  let isLoggedIn = false;
  if (req.session.user) isLoggedIn = true;
  res.render("entry/index", { title: "Stevens Sport", isLoggedIn: isLoggedIn });
});

module.exports = router;
