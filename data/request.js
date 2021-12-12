const mongoCollections = require("../config/mongoCollections");
const requestCollection = mongoCollections.activity;
const errorHandler = require("../Errors/errorHandler");
const { ObjectId } = require("mongodb");

const postRequest = async (posterId, venueId, requestText, date, time) => {
  const array = [posterId, venueId, requestText, date, time];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(posterId);
  errorHandler.checkIfValidObjectId(venueId);

  let acceptedUsers = [];

  const request = await requestCollection();

  let newRequest = {
    posterId,
    venueId,
    requestText,
    date,
    time,
    acceptedUsers,
  };

  const insertReq = await request.insertOne(newRequest);

  if (insertReq.insertedCount === 0) {
    throw "Could not add request";
  }

  return insertReq;
};

const acceptUserRequest = async (requestId, userId) => {
  const array = [requestId, userId];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfValidObjectId(requestId);
  errorHandler.checkIfValidObjectId(userId);

  requestId = ObjectId(requestId);

  const request = await requestCollection();
  const getRequest = await request.findOne({ _id: requestId });
  if (getRequest.playersFilled === getRequest.playersReq) {
    throw { code: 100 };
  }
  if (userId === getRequest.createdBy) {
    throw { code: 101 };
  }

  if (getRequest.playerAccepted.includes(userId)) {
    throw { code: 102 };
  }

  const acceptRequest = await request.updateOne(
    { _id: requestId },
    { $push: { playerAccepted: userId }, $inc: { playersFilled: 1 } }
  );

  if (acceptRequest.modifiedCount === 0) {
    throw { code: 103 };
  }

  return { userAdded: true };
};

module.exports = {
  postRequest,
  acceptUserRequest,
};
