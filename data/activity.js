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

const createActivity = async (activityTitle, activityBody, playersReq) => {
  let array = [activityTitle, activityBody, playersReq];
  playersReq = parseInt(playersReq);
  errorHandler.checkIfElementsExists(array);
  array = [activityTitle, activityBody];
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfItemInRange(playersReq);

  let playersFilled = 0;
  let createdBy = "617310bd50b4d0d56abef917";
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
  };
  const insertInfo = await activity.insertOne(newActivity);
  if (insertInfo.insertedCount === 0) throw "Could not add activity";
  const newId = insertInfo.insertedId;
  const activityList = await getActivityById(newId.toString());
  return activityList;
};

module.exports = { getActivity, getActivityById, createActivity };
