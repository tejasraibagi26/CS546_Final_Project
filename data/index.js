const venueData = require("./venue");
const userData = require("./user");
const reviewData = require("./reviews");
const commentData = require("./comments");
const request = require("./request");
const admin = require("./admin");
module.exports = {
  venues: venueData,
  user: userData,
  reviews: reviewData,
  comments: commentData,
  request: request,
  admin: admin,
};
