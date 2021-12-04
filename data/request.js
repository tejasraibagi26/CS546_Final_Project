const mongoCollections = require("../config/mongoCollections");
const requestCollection = mongoCollections.request;
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
  const acceptRequest = await request.updateOne(
    { _id: requestId },
    { $push: { acceptedUsers: userId } }
  );
};

module.exports = {
  postRequest,
  acceptUserRequest,
};
