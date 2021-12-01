const express = require("express");
const router = express.Router();
const errorHandler = require("../Errors/errorHandler");
const data = require("../data");
const activity = data.activity;

router.get("/", async (req, res) => {
  res.render("entry/index", { title: "Stevens Sport" });
});

module.exports = router;
