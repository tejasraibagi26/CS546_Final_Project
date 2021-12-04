const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("venue/create", {
    title: "Create Venue",
    isLoggedIn: req.session.user ? true : false,
  });
});

module.exports = router;
