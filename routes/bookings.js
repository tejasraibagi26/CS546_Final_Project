const express = require("express");
const router = express.Router();
const errorHandler = require("../Errors/errorHandler");
const data = require("../data");
const booking = data.booking;

router.post("/book", async (req, res) => {
  const bookingUserId = xss(req.body.bookingUserId);
  const bookedVenueId = xss(req.body.bookedVenueId);
  const startTime = xss(req.body.startTime);
  let endTime = xss(req.body.endTime);
  const date = xss(req.body.date);

  let array = [bookingUserId, bookedVenueId, timing, date];
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
    errorHandler.checkIfValidObjectId(bookingUserId);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(bookedVenueId);
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
    const booking = await booking.create(
      bookingUserId,
      bookedVenueId,
      startTime,
      endTime,
      date
    );
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
