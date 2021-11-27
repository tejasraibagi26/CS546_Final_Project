const mongoCollections = require("../config/mongoCollections");
const reports = mongoCollections.reports;
const venueCollection = mongoCollections.venue;
const commentCollection = mongoCollections.comments;
const errorHandler = require("../Errors/errorHandler");
const { ObjectId } = require("mongodb");

// Venue Request
const getAllRequests = async () => {
  const rCol = await venueCollection();
  let request = await rCol.find({}).toArray();
  request = request.filter(
    (req) => req.venueApproved === false && req.declineMsg === ""
  );
  return request;
};

const getRequestById = async (id) => {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfValidObjectId(id);
  errorHandler.checkIfElementNotEmptyString(array);

  const rCol = await venueCollection();
  const request = await rCol.findOne({ _id: ObjectId(id) });
  return request;
};

const approveRequest = async (id) => {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfValidObjectId(id);
  errorHandler.checkIfElementNotEmptyString(array);
  const rCol = await venueCollection();
  const update = await rCol.updateOne(
    { _id: ObjectId(id) },
    { $set: { venueApproved: true } }
  );

  if (update.modifiedCount === 0) throw { updated: false };
  return { updated: true };
};

const declineRequest = async (id) => {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfValidObjectId(id);
  errorHandler.checkIfElementNotEmptyString(array);

  const rCol = await venueCollection();
  const update = await rCol.updateOne(
    { _id: ObjectId(id) },
    {
      $set: { venueApproved: false, declineMsg: "Venue Request not approved." },
    }
  );

  if (update.modifiedCount === 0) throw "Cannot update";

  return { updated: true };
};

// Report
const getAllReports = async () => {
  const rCol = await reports();
  let reported = await rCol.find({}).toArray();
  reported = reported.filter((rep) => rep.reportApproved === 0);
  return reported;
};

const createReport = async (reportedId, reportedBy, reportComment) => {
  let array = [reportedId, reportedBy, reportComment];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(reportedId);
  errorHandler.checkIfValidObjectId(reportedBy);

  const rCol = await reports();
  let reportData = {
    reportedId,
    reportedBy,
    reportComment,
    reportApproved: 0,
  };
  const reportEd = await rCol.insertOne(reportData);
  if (reportEd.insertedCount === 0) throw "Cannot create";
  return { created: true };
};

const getReportById = async (id) => {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(id);

  id = id.trim();
  id = ObjectId(id);
  const rCol = await reports();
  const commentCol = await commentCollection();
  const reported = await rCol.findOne({ _id: id });
  const reportedComment = await commentCol.findOne({
    _id: ObjectId(reported.reportedId),
  });
  return { reported, reportedComment };
};

const denyReport = async (id) => {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(id);

  id = id.trim();
  id = ObjectId(id);
  const rCol = await reports();
  const deny = await rCol.updateOne(
    { _id: id },
    { $set: { reportApproved: -1 } }
  );
  // remove the original report from the comment collection
  if (deny.modifiedCount === 0) throw "Cannot update";
  return { updated: true };
};

const approveReport = async (id) => {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(id);

  id = id.trim();
  id = ObjectId(id);
  const rCol = await reports();
  const approve = await rCol.updateOne(
    { _id: id },
    { $set: { reportApproved: 1 } }
  );

  if (approve.modifiedCount === 0) throw "Cannot update";
  return { updated: true };
};

module.exports = {
  getAllRequests,
  getRequestById,
  approveRequest,
  declineRequest,
  getAllReports,
  getReportById,
  denyReport,
  approveReport,
};
