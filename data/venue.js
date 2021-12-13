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

const createNewVenue = async (
  venueName,
  venueAddress,
  venueTimings,
  sports,
  price,
  venueImage,
  venueApproved
) => {
  let array = [
    venueName,
    venueAddress,
    venueTimings,
    sports,
    price,
    venueImage,
  ];
  errorHandler.checkIfElementsExists(array);
  array = [venueName, venueAddress, venueImage];
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidArrayObject(venueTimings);

  const create = await venueCollection();
  let reviews = [];
  let venueRating = 0;
  let declineMsg = "";
  venueName = venueName.trim();
  venueAddress = venueAddress.trim();
  venueImage = venueImage.trim();

  let createVenueObject = {
    venueName,
    venueAddress,
    venueTimings,
    sports,
    price,
    venueImage,
    venueRating,
    reviews,
    venueApproved,
    declineMsg,
  };

  let createVenue = await create.insertOne(createVenueObject);

  if (createVenue.insertedCount === 0) throw "Error inserting venue";

  return createVenue.insertedId;
};

const searchVenue = async (sportToFind, min, max, rating) => {
  let array = [sportToFind];

  if (sportToFind) {
    errorHandler.checkIfElementsExists(array);
    errorHandler.checkIfElementsAreStrings(array);
    errorHandler.checkIfElementNotEmptyString(array);
    sportToFind = sportToFind.trim();
  }

  const searchVenueFromDB = await getAllVenues();
  let venueArr = [];

  if (sportToFind) {
    searchVenueFromDB.forEach((venue) => {
      venue.sports.forEach((sport) => {
        if (sport.toLowerCase().includes(sportToFind.toLowerCase())) {
          venueArr.push(venue);
        }
      });
    });
  } else {
    venueArr = searchVenueFromDB;
  }

  if (min != null || min != undefined) {
    venueArr = venueArr.filter((venue) => venue.price >= min);
  }
  if (max != null || max != undefined) {
    venueArr = venueArr.filter((venue) => venue.price <= max);
  }

  if (rating != null || rating != undefined) {
    venueArr = venueArr.filter((venue) => venue.venueRating >= rating);
  }

  venueArr = venueArr.filter((venue) => venue.venueApproved === true);

  if (venueArr.length === 0) throw "No venues found";
  return venueArr;
};

const updateVenueVisibility = async (id) => {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(id);

  id = id.trim();
  id = ObjectId(id);

  const venue = await venueCollection();
  let venueToUpdate = await venue.findOne({ _id: id });

  if (venueToUpdate === null) throw `Venue with id: ${id} not found`;

  venueToUpdate.venueApproved = !venueToUpdate.venueApproved;

  const updatedVenue = await venue.replaceOne({ _id: id }, venueToUpdate);

  if (updatedVenue.modifiedCount === 0) throw "Error updating venue";

  return venueToUpdate;
};

module.exports = {
  getAllVenues,
  getVenueById,
  createNewVenue,
  searchVenue,
  updateVenueVisibility,
};
