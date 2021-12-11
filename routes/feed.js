const express = require("express");
const router = express.Router();
const errorHandler = require("../Errors/errorHandler");
const eCodeToMsg = require("../Errors/codeMessage");
const data = require("../data");
const activity = data.activity;
const request = data.request;
const booking = data.booking;
const venue = data.venues;
const user = data.user;
const xss = require("xss");

router.get("/", async (req, res) => {
  let error = req.query.error || false;
  let eCode = req.query.eCode || null;
  let success = req.query.success || false;
  let message;
  if (error) {
    message = eCodeToMsg.getMessageForCode(eCode);
  } else if (success && eCode) {
    message = eCodeToMsg.getMessageForCode(eCode);
  } else {
    message = "Invite joined!";
  }
  let activities = await activity.getActivity();
  let users = [];
  let venues = [];
  let bookings = [];

  for (let i = 0; i < activities.length; i++) {
    let userData = await user.getUserById(activities[i].createdBy);
    let userName = `${userData.firstName} ${userData.lastName}`;
    users.push(userName);
  }
  for (let i = 0; i < activities.length; i++) {
    let venueData = await venue.getVenueById(activities[i].venueReq);
    venues.push(venueData);
  }
  for (let i = 0; i < activities.length; i++) {
    let bookingData = await booking.getBookingById(activities[i].bookingId);
    bookings.push(bookingData);
  }
  for (let i = 0; i < activities.length; i++) {
    activities[i].userName = users[i];
    activities[i].venue = venues[i];
    if (
      activities[i].venue._id.toString() ===
      bookings[i].bookedVenueId.toString()
    ) {
      activities[i].venue.booking = bookings[i];
    }
  }

  res.status(200).render("entry/activity", {
    title: "Feed",
    posts: activities,
    isLoggedIn: req.session.user,
    error: error,
    eCode: eCode,
    message: message,
    success: success,
  });
});

router.get("/posts/create", async (req, res) => {
  const id = req.session.user.id;
  const getAllBookingsByUser = await booking.getBookingByUser(id);
  let venues = [];
  for (let i = 0; i < getAllBookingsByUser.length; i++) {
    let venueData = await venue.getVenueById(
      getAllBookingsByUser[i].bookedVenueId
    );
    venueData.bookingId = getAllBookingsByUser[i]._id.toString();
    venues.push(venueData);
  }

  res.render("entry/create", {
    title: "Create Post",
    isLoggedIn: req.session.user ? true : false,
    venueData: venues,
  });
});

router.post("/posts/create", async (req, res) => {
  let activityTitle = xss(req.body.activityTitle);
  let activityBody = xss(req.body.activityBody);
  let playerReq = parseInt(xss(req.body.playerReq));
  let creatorId = req.session.user.id;
  let data = xss(req.body.venueReq);
  let venueReq = data.split("|")[0];
  let bookingId = data.split("|")[1];
  let array = [
    activityTitle,
    activityBody,
    playerReq,
    creatorId,
    venueReq,
    bookingId,
  ];
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
    errorHandler.checkIfItemInRange(venueReq);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(creatorId);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(bookingId);
  } catch (error) {
    return res.status(500).json({ error: error });
  }

  try {
    const create = await activity.createActivity(
      activityTitle,
      activityBody,
      playerReq,
      creatorId,
      venueReq,
      bookingId
    );
    return res.redirect("/feed");
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.get("/invite/accept", async (req, res) => {
  const id = req.query.id;
  // const userId = req.query.user;
  const uid = req.session.user.id;
  // if (userId === uId) {
  //   return res.redirect("/feed?error=true&eCode=101");
  // }

  let array = [id, uid];
  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(id);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(uid);
  } catch (error) {
    return res.status(500).json({ error: error });
  }

  try {
    const acceptReq = await request.acceptUserRequest(id, uid);
    if (acceptReq.userAdded) {
      return res.redirect("/feed?success=true");
    }
  } catch (error) {
    return res.redirect(`/feed?error=true&eCode=${error.code}`);
  }
});

module.exports = router;
