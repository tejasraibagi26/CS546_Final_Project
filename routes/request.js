const express = require("express");
const router = express.Router();
const data = require("../data");
const requestData = data.request;
const errorHandler = require("../Errors/errorHandler");

router.post("/", async (req, res) => {
  let { posterId, venueId, requestText, date, time } = req.body;
  let array = [posterId, venueId, requestText, date, time];
  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const addReq = await requestData.postRequest(
      posterId,
      venueId,
      requestText,
      date,
      time
    );
    res.status(200).json(addReq);
  } catch (error) {
    res.status(404).json({ err: error });
  }
});

router.post("/accept", async (req, res) => {
  let { requestId, venueId } = req.body;
  let array = [requestId, venueId];
  try {
    errorHandler.checkIfElementsExists(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidObjectId(requestId);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidObjectId(venueId);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const addReq = await requestData.acceptUserRequest(requestId, venueId);
    res.status(200).json(addReq);
  } catch (error) {
    res.status(404).json({ err: error });
  }
});

module.exports = router;
