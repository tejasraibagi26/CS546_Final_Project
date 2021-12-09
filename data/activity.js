const mongoCollections = require("../config/mongoCollections");
const activityCollection = mongoCollections.activity;
const { ObjectId } = require("mongodb");
const errorHandler = require("../Errors/errorHandler");

const getActivity = async () => {
  const activity = await activityCollection();
  const activityList = await activity.find({}).toArray();
  return activityList;
};

const getActivityById = async (id) => {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfValidObjectId(id);
  errorHandler.checkIfElementNotEmptyString(array);
  const activity = await activityCollection();
  const activityList = await activity.findOne({ _id: ObjectId(id) });
  return activityList;
};

const createActivity = async (
  activityTitle,
  activityBody,
  playersReq,
  creatorId,
  venueReq,
  bookingId
) => {
  let array = [
    activityTitle,
    activityBody,
    playersReq,
    creatorId,
    venueReq,
    bookingId,
  ];
  playersReq = parseInt(playersReq);
  errorHandler.checkIfElementsExists(array);
  array = [activityTitle, activityBody];
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfItemInRange(playersReq);
  errorHandler.checkIfValidObjectId(creatorId);
  errorHandler.checkIfValidObjectId(venueReq);
  errorHandler.checkIfValidObjectId(bookingId);

  let playersFilled = 0;
  let createdBy = creatorId;
  let playerAccepted = [];
  let creationDateTime = new Date().toLocaleString();
  const activity = await activityCollection();
  const newActivity = {
    activityTitle,
    activityBody,
    playersReq,
    playersFilled,
    playerAccepted,
    createdBy,
    creationDateTime,
    venueReq,
    bookingId,
  };
  const insertInfo = await activity.insertOne(newActivity);
  if (insertInfo.insertedCount === 0) throw "Could not add activity";
  const newId = insertInfo.insertedId;
  const activityList = await getActivityById(newId.toString());
  return activityList;
};

module.exports = { getActivity, getActivityById, createActivity };
