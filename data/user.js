const mongoCollections = require("../config/mongoCollections");
const userCollection = mongoCollections.user;
const errorHandler = require("../Errors/errorHandler");
const { ObjectId } = require("mongodb");

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
  const allUsers = await getAllUsers();
  const friends = [];

  for (let user of allUsers) {
    if (friendsIds.includes(user._id)) {
      friends.push(user);
    }
  }

  return friends;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  searchUsers,
  getUserByEmail,
  getFriends,
};
