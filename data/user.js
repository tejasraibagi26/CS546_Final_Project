const mongoCollections = require("../config/mongoCollections");
const userCollection = mongoCollections.user;
const errorHandler = require("../Errors/errorHandler");
const { ObjectId } = require("mongodb");
const activity = require("./activity");
const booking = require("./booking");

async function getAllUsers() {
  const users = await userCollection();
  let allUsers = await users.find({}).toArray();
  return allUsers;
}

async function getUserById(id) {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(id);

  id = ObjectId(id);
  const users = await userCollection();

  let user = await users.findOne({ _id: id });

  if (user == null) throw "Could not find user by Id";

  return user;
}

async function createUser(
  firstName,
  lastName,
  email,
  password,
  age,
  gender,
  role
) {
  let inputs = [firstName, lastName, email, password, gender, age, role];
  let stringInputs = [firstName, lastName, email, password, gender, role];
  errorHandler.checkIfElementsExists(inputs);
  errorHandler.checkIfElementsAreStrings(stringInputs);
  errorHandler.checkIfElementNotEmptyString(stringInputs);
  errorHandler.checkIfValidEmail(email);
  errorHandler.checkIfValidRole(role);
  errorHandler.checkIfValidAge(age);

  const users = await userCollection();
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    age: age,
    gender: gender,
    postId: [],
    reviewId: [],
    commentId: [],
    friends: [],
    role: role,
    upvotedReviews: [],
    downvotedReviews: [],
    upvotedComments: [],
    downvotedComments: [],
    biography: "",
  };

  let insertData = await users.insertOne(newUser);

  if (insertData.insertedCount == 0) throw "Could not insert user";

  return { msg: "Inserted user", added: true };
}

async function searchUsers(firstName, lastName) {
  let fullName = [firstName, lastName];
  errorHandler.checkIfElementsExists(fullName);
  errorHandler.checkIfElementsAreStrings(fullName);
  errorHandler.checkIfElementNotEmptyString(fullName);

  fullName = [firstName.toLowerCase(), lastName.toLowerCase()];

  const users = await getAllUsers();
  let foundUsers = [];
  for (let user of users) {
    if (
      user.firstName.toLowerCase() == fullName[0] &&
      user.lastName.toLowerCase() == fullName[1]
    ) {
      foundUsers.push(user);
    }
  }

  if (foundUsers.length == 0) {
    throw "No users found with this first and last name";
  }

  return foundUsers;
}

async function getUserByEmail(email) {
  let emailArray = [email];

  errorHandler.checkIfElementsExists(emailArray);
  errorHandler.checkIfElementsAreStrings(emailArray);
  errorHandler.checkIfElementNotEmptyString(emailArray);
  errorHandler.checkIfValidEmail(email);

  const users = await getAllUsers();

  for (let user of users) {
    if (user.email == email) {
      return user;
    }
  }

  throw "No user with email found";
}

async function getFriends(id) {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(id);

  const currentUser = await getUserById(id);
  const friendsIds = currentUser.friends;
  const friends = [];

  for (let i of friendsIds) {
    let friend = await getUserById(i);
    friends.push(friend);
  }

  return friends;
}

async function getActiveGames(id) {
  let array = [id];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(id);

  const allActivities = await activity.getActivity();
  let activeGames = [];
  let pastGames = [];
  let currentBooking = null;
  let today = new Date();

  for (let i of allActivities) {
    if (i.playerAccepted.includes(id)) {
      currentBooking = await booking.getBookingById(i.bookingId);
      let dashes = [
        currentBooking.date.indexOf("-"),
        currentBooking.date.lastIndexOf("-"),
      ];
      let year = currentBooking.date.substring(0, 4);
      let month = currentBooking.date.substring(dashes[0] + 1, dashes[1]);
      let day = currentBooking.date.substring(
        dashes[1] + 1,
        currentBooking.date.length
      );
      let hour = currentBooking.endTime.substring(0, 2);
      let minute = currentBooking.endTime.substring(3, 5);
      let bookingDate = new Date(year, month - 1, day, hour, minute);
      if (bookingDate < today) {
        let participants = [];
        for (let j of i.playerAccepted) {
          let part = await getUserById(j);
          participants.push(part);
        }
        let game = {
          activityTitle: i.activityTitle,
          activityBody: i.activityBody,
          parts: participants,
        };
        pastGames.push(game);
      } else {
        let participants = [];
        for (let j of i.playerAccepted) {
          let part = await getUserById(j);
          participants.push(part);
        }
        let game = {
          activityTitle: i.activityTitle,
          activityBody: i.activityBody,
          parts: participants,
        };
        activeGames.push(game);
      }
    }
  }

  return { activeGames: activeGames, pastGames: pastGames };
}

async function addFriend(userId, newFriendId) {
  let array = [userId, newFriendId];
  errorHandler.checkIfElementsExists(array);
  errorHandler.checkIfElementsAreStrings(array);
  errorHandler.checkIfElementNotEmptyString(array);
  errorHandler.checkIfValidObjectId(userId);
  errorHandler.checkIfValidObjectId(newFriendId);

  const users = await userCollection();

  const currentUser = await getUserById(userId);
  for (let i of currentUser.friends) {
    if (i == newFriendId) {
      throw "User is already a friend";
    }
  }

  try {
    const updateInfo = await users.updateOne(
      { _id: ObjectId(userId) },
      {
        $push: {
          friends: newFriendId,
        },
      }
    );

    const updateInfo2 = await users.updateOne(
      { _id: ObjectId(newFriendId) },
      {
        $push: {
          friends: userId,
        },
      }
    );

    return { msg: "Friend added" };
  } catch (e) {
    throw e;
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  searchUsers,
  getUserByEmail,
  getFriends,
  getActiveGames,
  addFriend,
};
