const mongoCollections = require("../config/mongoCollections");
const bookings = mongoCollections.bookings;
const errorHandler = require("../Errors/errorHandler");

const create = async (
  bookingUserId,
  bookedVenueId,
  startTime,
  endTime,
  date
) => {
  let array = [bookedUserId, bookedVenueId, startTime, endTime, date];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(bookingUserId);
  errorHandler.checkIfValidObjectId(bookedVenueId);
  errorHandler.checkIfTimePeriodValid(startTime, endTime);
  errorHandler.checkIfCurrentDate(date);

  const bookingCollection = await bookings();
  const newBooking = { bookingUserId, bookedVenueId, startTime, endTime, date };

  const insertInfo = await bookingCollection.insertOne(newBooking);
  if (insertInfo.insertedCount === 0) throw "Could not add booking";
  return { bookingStatus: true, bookingId: insertInfo.insertedId };
};

module.exports = { create };
