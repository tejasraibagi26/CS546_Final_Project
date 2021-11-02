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
  console.log(id);
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

const searchVenue = async (venueName) => {
  let array = [venueName];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);

  venueName = venueName.trim();

  const searchVenue = await getAllVenues();

  let venueArr = [];

  searchVenue.forEach((venue) => {
    if (venue["venueName"].toLowerCase().includes(venueName.toLowerCase())) {
      venueArr.push(venue);
    }
  });

  return venueArr;
};

module.exports = {
  getAllVenues,
  getVenueById,
  createNewVenue,
  searchVenue,
};
