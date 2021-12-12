const mongoCollections = require("../config/mongoCollections");
const activityCollection = mongoCollections.activity;
const { ObjectId } = require("mongodb");
const errorHandler = require("../Errors/errorHandler");

const getPostById = async (id) => {
  const array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(id);

  const activity = await activityCollection();
  const getPost = await activity.findOne({ _id: ObjectId(id) });
  if (getPost === null) throw { err: "No post found", status: 404 };

  return getPost;
};

module.exports = { getPostById };
