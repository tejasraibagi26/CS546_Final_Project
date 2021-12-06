const express = require("express");
const router = express.Router();
const errorHandler = require("../Errors/errorHandler");
const data = require("../data");
const activity = data.activity;
const user = data.user;
const xss = require("xss");

router.get("/", async (req, res) => {
  let activities = await activity.getActivity();
  let users = [];
  for (let i = 0; i < activities.length; i++) {
    let userData = await user.getUserById(activities[i].createdBy);
    let userName = `${userData.firstName} ${userData.lastName}`;
    users.push(userName);
  }
  for (let i = 0; i < activities.length; i++) {
    activities[i].userName = users[i];
  }
  res.status(200).render("entry/activity", {
    title: "Feed",
    posts: activities,
    isLoggedIn: req.session.user ? true : false,
  });
});

router.get("/posts/create", (req, res) => {
  res.render("entry/create", {
    title: "Create Post",
    isLoggedIn: req.session.user ? true : false,
  });
});

router.post("/posts/create", async (req, res) => {
  console.log(req.body);
  let activityTitle = xss(req.body.activityTitle);
  let activityBody = xss(req.body.activityBody);
  let playerReq = parseInt(xss(req.body.playerReq));
  let creatorId = req.session.user.id;
  let array = [activityTitle, activityBody, playerReq, creatorId];
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
    errorHandler.checkIfValidObjectId(creatorId);
  } catch (error) {
    return res.status(500).json({ error: error });
  }

  try {
    const create = await activity.createActivity(
      activityTitle,
      activityBody,
      playerReq,
      creatorId
    );
    return res.redirect("/feed");
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
