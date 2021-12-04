const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("notFound/404", { title: "Not Found" });
});

module.exports = router;
