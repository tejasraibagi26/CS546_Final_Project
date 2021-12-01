const express = require("express");
const router = express.Router();
const errorHandler = require("../Errors/errorHandler");
const data = require("../data");
const activity = data.activity;

router.get("/", async (req, res) => {
  const activities = await activity.getActivity();
  res
    .status(200)
    .render("entry/activity", { title: "Feed", posts: activities });
});

router.get("/posts/create", (req, res) => {
  res.render("entry/create", { title: "Create Post" });
});

router.post("/posts/create", async (req, res) => {
  let activityTitle = xss(req.body.activityTitle);
  let activityBody = xss(req.body.activityBody);
  let playerReq = parseInt(xss(req.body.playerReq));

  let array = [activityTitle, activityBody, playerReq];
  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  array = [activityTitle, activityBody];
  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  try {
    errorHandler.checkIfItemInRange(playerReq);
  } catch (error) {
    return res.status(500).json({ error: error });
  }

  try {
    const create = await activity.createActivity(
      activityTitle,
      activityBody,
      playerReq
    );
    return res.status(200).json({ create });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
