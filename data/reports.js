const mongoCollections = require("../config/mongoCollections");
const reportCollection = mongoCollections.reports;
const errorHandler = require("../Errors/errorHandler");
const { ObjectId } = require("mongodb");

const reportVenue = async (
  venueId,
  userId,
  reportComment,
  reportContentType,
  reportType
) => {
  let array = [venueId, userId, reportComment, reportContentType, reportType];

  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(venueId);
  errorHandler.checkIfValidObjectId(userId);
  errorHandler.checkReportType(reportType);

  const report = await reportCollection();
  const reportBody = {
    venueId: venueId,
    userId: userId,
    reportComment: reportComment,
    reportContentType: reportContentType,
    reportApproved: 0,
    reportType: reportType,
  };

  const addReport = await report.insertOne(reportBody);
  if (addReport.insertedCount === 0) throw "Could not add report";

  return { success: true };
};

module.exports = {
  reportVenue,
};
