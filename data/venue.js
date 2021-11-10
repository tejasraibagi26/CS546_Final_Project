const mongoCollections = require("../config/mongoCollections");
const venueCollection = mongoCollections.venue;
const errorHandler = require("../Errors/errorHandler");
const { ObjectId } = require("mongodb");

const getAllVenues = async () => {
  const venue = await venueCollection();

  let allVenues = await venue.find({}).toArray();

  if (allVenues === null) throw "No venues found.";

  return allVenues;
};

const getVenueById = async (id) => {
  //Error Handling
  const array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfValidObjectId(id);
  errorHandler.checkIfElementNotEmptyString(array);

  id = id.trim();
  id = ObjectId(id);
  const venue = await venueCollection();

  let venueByIdOrName = await venue.findOne({ _id: id });

  if (venueByIdOrName === null) throw `Venue with id: ${id} not found`;

  return venueByIdOrName;
};

const createNewVenue = async (venueName, venueAddress, venueTimings) => {
  let array = [venueName, venueAddress, venueTimings];
  errorHandler.checkIfElementsExists(array);
  array = [venueName, venueAddress];
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidArrayObject(venueTimings);

  const create = await venueCollection();
  let reviews = [];
  let venueRating = 0;

  venueName = venueName.trim();
  venueAddress = venueAddress.trim();

  let createVenueObject = {
    venueName,
    venueAddress,
    venueTimings,
    venueRating,
    reviews,
  };

  let createVenue = await create.insertOne(createVenueObject);

  if (createVenue.insertedCount === 0) throw "Error inserting venue";

  return { msg: "Venue added!" };
};

const searchVenue = async (sportToFind, min, max, rating) => {
  let array = [sportToFind];
  min = min || 0;
  max = max || 1000000;
  rating = rating || 0;
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  sportToFind = sportToFind.trim();
  const searchVenueFromDB = await getAllVenues();
  let venueArr = [];

  searchVenueFromDB.forEach((venue) => {
    venue.sports.forEach((sport) => {
      if (sport.toLowerCase() === sportToFind.toLowerCase()) {
        venueArr.push(venue);
      }
    });
  });

  if (min != null || min != undefined) {
    venueArr = venueArr.filter((venue) => venue.price >= min);
  }
  if (max != null || max != undefined) {
    venueArr = venueArr.filter((venue) => venue.price <= max);
  }

  if (rating != null || rating != undefined) {
    venueArr = venueArr.filter((venue) => venue.venueRating >= rating);
  }

  if (venueArr.length === 0) throw "No venues found";
  return venueArr;
};

module.exports = {
  getAllVenues,
  getVenueById,
  createNewVenue,
  searchVenue,
};
