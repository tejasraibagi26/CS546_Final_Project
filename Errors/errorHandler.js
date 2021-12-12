const { ObjectId } = require("mongodb");

const checkIfElementsExists = (array) => {
  array.forEach((element) => {
    if (element === undefined || element === null) throw `Element not defined`;
  });
};

const checkIfElementsAreStrings = (array) => {
  array.forEach((element) => {
    if (typeof element !== "string") throw `Element not of type string`;
  });
};

const checkIfValidObjectId = (id) => {
  if (!ObjectId.isValid(id)) throw "Incorrect Object Id";
};

const checkIfElementNotEmptyString = (array) => {
  array.forEach((element) => {
    if (element.trim() === "") throw `Element cannot be empty string`;
  });
};

const checkIfValidArrayObject = (obj) => {
  if (!Array.isArray(obj)) throw "Not an array";
  obj.forEach((el) => {
    if (typeof el !== "object") throw "Not of type object";
    const keys = Object.keys(el);
    if (keys.length !== 2) throw "Value missing from timings";

    if (keys[0] !== "timeSlot" || keys[1] !== "slotsAvailable")
      throw "Incorrect key";
    if (typeof el[keys[0]] !== "string") throw "timeSlot not a string";
    if (typeof el[keys[1]] !== "number") throw "slotsAvailable not a number";
  });
};

const checkIfValidEmail = (email) => {
  let atsign = email.indexOf("@");
  if (atsign == -1) throw "Invalid email";
  if (atsign == 0) throw "Invalid email";
  let domain = email.substring(atsign + 1, email.length);
  if (domain.length == 0) throw "Invalid email";
  let dotsign = domain.indexOf(".");
  if (dotsign == -1) throw "Invalid email";
  if (dotsign == 0) throw "Invalid email";
  if (domain.substring(dotsign + 1, domain.length).length == 0)
    throw "Invalid email";
};

const checkIfValidAge = (age) => {
  if (typeof age != "number") throw "Age must be a number";
  if (age < 0 || age > 122) throw "Invalid age";
};

const checkIfValidRating = (rating) => {
  if (typeof rating != "number") throw "Rating must be a number";
  if (rating < 0 || rating > 5) throw "Rating should be between 0 to 5";
};

const checkIfValidRole = (role) => {
  let roles = ["User", "Owner", "Admin"];
  if (!roles.includes(role)) throw "Invalid role";
};

const checkIfItemInRange = (item) => {
  if (item <= 0) throw "Cannot be 0";
};

const checkIfCurrentDate = (date) => {
  let currentDate = new Date().toLocaleDateString();
  if (Date.parse(date) - Date.parse(currentDate) < 0)
    throw "Date cannot be in the past";
};

const checkIfTimePeriodValid = (startTime, endTime) => {
  if (startTime > endTime) throw "Start time cannot be greater than end time";
};

const checkReportType = (reportType) => {
  let reportTypes = ["post", "comment", "venues"];
  if (!reportTypes.includes(reportType.toLowerCase()))
    throw "Invalid report type";
};

module.exports = {
  checkIfElementsExists,
  checkIfElementsAreStrings,
  checkIfValidObjectId,
  checkIfElementNotEmptyString,
  checkIfValidArrayObject,
  checkIfValidEmail,
  checkIfValidAge,
  checkIfValidRole,
  checkIfItemInRange,
  checkIfCurrentDate,
  checkIfTimePeriodValid,
  checkIfValidRating,
  checkReportType,
};
