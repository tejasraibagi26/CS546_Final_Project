const venueData = require("./venue");
const userData = require("./user");
const reviewData = require("./reviews");
const request = require("./request");

module.exports = {
  venues: venueData,
  user: userData,
  reviews: reviewData,
  request: request,
};
