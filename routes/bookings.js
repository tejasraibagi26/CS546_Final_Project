const express = require("express");
const router = express.Router();
const errorHandler = require("../Errors/errorHandler");
const data = require("../data");
const booking = data.booking;
const xss = require("xss");

router.post("/book", async (req, res) => {
  const bookedVenueId = xss(req.body.bookingVenueId);
  const startTime = xss(req.body.startTime);
  const endTime = xss(req.body.endTime);
  const date = xss(req.body.date);
  const bookedUserId = req.session.user.id;
  const cost = xss(req.body.cost);

  let array = [bookedVenueId, bookedUserId, startTime, endTime, date, cost];
  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(bookedVenueId);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(bookedUserId);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfCurrentDate(date);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfTimePeriodValid(startTime, endTime);
  } catch (error) {
    return res.status(400).json({ error: error });
  }

  try {
    const book = await booking.create(
      bookedVenueId,
      bookedUserId,
      startTime,
      endTime,
      date,
      cost
    );

    res.render("venue/booking", {
      title: "Booking",
      isLoggedIn: req.session.user,
    });

    //res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
