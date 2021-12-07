const express = require("express");
const router = express.Router();
const data = require("../data");
const reports = data.report;
const xss = require("xss");
const errorHandler = require("../Errors/errorHandler");

router.post("/:venueId/:type", async (req, res) => {
  const venueId = req.params.venueId;
  const userId = req.session.user.id;
  const reportComment = xss(req.body.reportComment);
  const reportContentType = xss(req.body.reportContentType);
  const reportType = req.params.type;

  let array = [venueId, userId, reportComment, reportContentType, reportType];

  console.log(array);

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
    errorHandler.checkIfValidObjectId(venueId);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkIfValidObjectId(userId);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
  try {
    errorHandler.checkReportType(reportType);
  } catch (error) {
    return res.status(400).json({ error: error });
  }

  try {
    const report = await reports.reportVenue(
      venueId,
      userId,
      reportComment,
      reportContentType,
      reportType
    );
    let redirectSite = "";
    if (reportType === "venue") {
      redirectSite = "/venues" + venueId;
    } else if (reportType === "comment") {
      redirectSite = "/venues/" + venueId;
    } else {
      redirectSite = "/feed?success=true&eCode=200";
    }
    return res.status(200).redirect(`${redirectSite}`);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
