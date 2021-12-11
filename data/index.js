const venueData = require("./venue");
const userData = require("./user");
const reviewData = require("./reviews");
const commentData = require("./comments");
const request = require("./request");
const report = require("./reports");
const admin = require("./admin");
const activity = require("./activity");
const booking = require("./booking");
const post = require("./post");

module.exports = {
  venues: venueData,
  user: userData,
  reviews: reviewData,
  comments: commentData,
  request: request,
  admin: admin,
  activity: activity,
  booking: booking,
  report: report,
  post: post,
};
