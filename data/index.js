const venueData = require("./venue");
const userData = require("./user");
const request = require("./request");
const admin = require("./admin");
module.exports = {
  venues: venueData,
  user: userData,
  request: request,
  admin: admin,
};
