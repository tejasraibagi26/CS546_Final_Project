const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("venue/create", { title: "Create Venue" });
});

module.exports = router;
