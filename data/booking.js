const { ObjectId } = require("bson");
const mongoCollections = require("../config/mongoCollections");
const bookings = mongoCollections.bookings;
const errorHandler = require("../Errors/errorHandler");

const create = async (
  bookedVenueId,
  bookedUserId,
  startTime,
  endTime,
  date,
  cost
) => {
  let array = [bookedUserId, bookedVenueId, startTime, endTime, date, cost];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(bookedVenueId);
  errorHandler.checkIfValidObjectId(bookedUserId);
  errorHandler.checkIfTimePeriodValid(startTime, endTime);
  errorHandler.checkIfCurrentDate(date);

  const bookingCollection = await bookings();
  const newBooking = {
    bookedVenueId,
    bookedUserId,
    startTime,
    endTime,
    date,
    cost,
  };

  const insertInfo = await bookingCollection.insertOne(newBooking);
  if (insertInfo.insertedCount === 0) throw "Could not add booking";
  return { bookingStatus: true, bookingId: insertInfo.insertedId };
};

const getBookingByUser = async (id) => {
  errorHandler.checkIfElementsExists([id]);
  errorHandler.checkIfElementsAreStrings([id]);
  errorHandler.checkIfElementNotEmptyString([id]);
  errorHandler.checkIfValidObjectId(id);
  const bookingCollection = await bookings();
  const data = bookingCollection.find({ bookedUserId: id }).toArray();
  if (data.length === 0) throw "No booking found";
  return data;
};

const getBookingById = async (id) => {
  errorHandler.checkIfElementsExists([id]);
  errorHandler.checkIfElementsAreStrings([id]);
  errorHandler.checkIfElementNotEmptyString([id]);
  errorHandler.checkIfValidObjectId(id);
  const bookingCollection = await bookings();
  const data = bookingCollection.findOne({ _id: ObjectId(id) });
  if (data.length === 0) throw "No booking found";
  return data;
};

module.exports = { create, getBookingByUser, getBookingById };
