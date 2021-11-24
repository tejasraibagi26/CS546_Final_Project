const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("entry/index", { title: "Stevens Sport" });
});

module.exports = router;
