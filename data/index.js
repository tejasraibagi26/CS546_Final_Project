const venueData = require("./venue");
const userData = require("./user");
const request = require("./request");
const admin = require("./admin");
const activity = require("./activity");
const booking = require("./booking");

module.exports = {
  venues: venueData,
  user: userData,
  request: request,
  admin: admin,
  activity: activity,
  booking: booking,
};
