const mongoCollections = require("../config/mongoCollections");
const activityCollection = mongoCollections.activity;
const bookingCollection = mongoCollections.bookings;
const { ObjectId } = require("mongodb");
const errorHandler = require("../Errors/errorHandler");
const CronJob = require("cron").CronJob;

//Automated Job to hide the activity post who's deadline has passed
var removeActivityOnExpire = new CronJob("0 * * * * *", async () => {
  try {
    const activity = await activityCollection();
    //Find all activity that are currently visible
    const getAllActivity = await activity.find({ postVisible: true }).toArray();
    getAllActivity.forEach(async (act) => {
      const booking = await bookingCollection();
      const getDateFromBooking = await booking.findOne({
        _id: ObjectId(act.bookingId),
      });
      //Get the date from the booking
      let date = getDateFromBooking.date;
      //Get the end time hour from the booking
      let time = getDateFromBooking.endTime.split(":")[0];
      //Set the time to LocateString format
      if (time > 12) {
        //Convert to 24 hour format
        time = time - 12;
        //Append min:sec AM/PM
        time = time + ":00:00 PM";
      } else if (time < 12) {
        //Append min:sec AM/PM
        time = time + ":00:00 AM";
      } else {
        //None match set it to 12:00:00 PM
        time = "12:00:00 PM";
      }
      let currentDate = new Date().toLocaleString();
      //Date it stores with '-' instead of '/' hence split it
      date = date.split("-");
      //Convert to Date format
      date = date[1] + "/" + date[2] + "/" + date[0];
      //Merge to get date in LocaleString format
      finalDate = `${date}, ${time}`;
      //Calculate difference between current date and deadline
      const difference = Date.parse(finalDate) - Date.parse(currentDate);
      //If difference is less than 0 then update the visibility to false
      if (difference < 0) {
        //Remove from db
        await activity.updateOne(
          { _id: ObjectId(act._id) },
          { $set: { postVisible: false } }
        );
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});
//Start the job
removeActivityOnExpire.start();

const getActivity = async () => {
  const activity = await activityCollection();
  const activityList = await activity.find({ postVisible: true }).toArray();
  console.log(activityList);
  return activityList;
};

const getActivityById = async (id) => {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfValidObjectId(id);
  errorHandler.checkIfElementNotEmptyString(array);
  const activity = await activityCollection();
  const activityList = await activity.findOne({ _id: ObjectId(id) });
  return activityList;
};

const createActivity = async (
  activityTitle,
  activityBody,
  playersReq,
  creatorId,
  venueReq,
  bookingId
) => {
  let array = [
    activityTitle,
    activityBody,
    playersReq,
    creatorId,
    venueReq,
    bookingId,
  ];
  playersReq = parseInt(playersReq);
  errorHandler.checkIfElementsExists(array);
  array = [activityTitle, activityBody];
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfItemInRange(playersReq);
  errorHandler.checkIfValidObjectId(creatorId);
  errorHandler.checkIfValidObjectId(venueReq);
  errorHandler.checkIfValidObjectId(bookingId);

  let playersFilled = 0;
  let createdBy = creatorId;
  let playerAccepted = [];
  let creationDateTime = new Date().toLocaleString();
  const activity = await activityCollection();
  const newActivity = {
    activityTitle,
    activityBody,
    playersReq,
    playersFilled,
    playerAccepted,
    createdBy,
    creationDateTime,
    venueReq,
    bookingId,
    postVisible: true,
  };
  const insertInfo = await activity.insertOne(newActivity);
  if (insertInfo.insertedCount === 0) throw "Could not add activity";
  const newId = insertInfo.insertedId;
  const activityList = await getActivityById(newId.toString());
  return activityList;
};

module.exports = { getActivity, getActivityById, createActivity };
