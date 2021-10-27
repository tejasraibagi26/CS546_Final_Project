const { ObjectId } = require("mongodb");

const checkIfExists = (array) => {
  array.forEach((element) => {
    if (element === undefined || element === null)
      throw `${element} not defined`;
  });
};

const checkIfIsString = (array) => {
  array.forEach((element) => {
    if (typeof element !== "string") throw `${element} not of type string`;
  });
};

const checkIfValidObjectId = (id) => {
  if (!ObjectId.isValid(id)) throw "Incorrect Object Id";
};

const checkIfNotEmptyString = (array) => {
  array.forEach((element) => {
    if (element.trim() === "") throw `${element} cannot be empty string`;
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

module.exports = {
  checkIfExists,
  checkIfIsString,
  checkIfValidObjectId,
  checkIfNotEmptyString,
  checkIfValidArrayObject,
};
