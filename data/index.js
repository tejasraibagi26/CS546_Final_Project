const venueData = require("./venue");
const userData = require("./user");
const reviewData = require("./reviews");
const request = require("./request");
const admin = require("./admin");
module.exports = {
  venues: venueData,
  user: userData,
  reviews: reviewData,
  request: request,
  admin: admin,
};
