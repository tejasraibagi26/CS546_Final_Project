const express = require("express");
const router = express.Router();
const data = require("../data");
const errorHandler = require("../Errors/errorHandler");
const user = data.user;
const bcrypt = require("bcrypt");
const saltRounds = 16;
const xss = require("xss");

router.get("/login", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/user/profile/" + req.session.user.id);
  }
  res.render("user/login", {
    title: "Login",
    action: "/user/login",
  });
});

router.get("/register", async (req, res) => {
  res.render("user/register", {
    title: "Register",
  });
});

router.get("/profile/:id", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/user/login");
  }

  let id = req.params.id;
  try {
    errorHandler.checkIfElementsExists([id]);
    errorHandler.checkIfElementsAreStrings([id]);
    errorHandler.checkIfElementNotEmptyString([id]);
    errorHandler.checkIfValidObjectId(id);
  } catch (e) {
    res.status(404).redirect("/404");
    return;
  }

  let userById = null;
  try {
    userById = await user.getUserById(id);
  } catch (e) {
    res.status(404).redirect("/404");
    return;
  }

  let myProfile = id == req.session.user.id;
  let showAddFriend = true;
  if (myProfile) {
    showAddFriend = false;
  }

  let friends = [];
  try {
    friends = await user.getFriends(id);
  } catch (e) {
    res.json({ err: e });
    return;
  }
  let myFriends = [];
  try {
    myFriends = await user.getFriends(req.session.user.id);
  } catch (e) {
    res.json({ err: e });
    return;
  }
  for (let i of myFriends) {
    if (i._id == id) {
      showAddFriend = false;
    }
  }
  let userGames = null;
  try {
    userGames = await user.getActiveGames(id);
  } catch (e) {
    res.json({ err: e });
    return;
  }

  res.render("user/profile", {
    title: "Profile",
    currentUser: userById,
    activeGames: userGames.activeGames,
    pastGames: userGames.pastGames,
    friends: friends,
    isLoggedIn: req.session.user,
    myProfile: myProfile,
    showAddFriend: showAddFriend,
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/user/login");
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    errorHandler.checkIfElementsExists([id]);
    errorHandler.checkIfElementsAreStrings([id]);
    errorHandler.checkIfElementNotEmptyString([id]);
    errorHandler.checkIfValidObjectId(id);
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }

  try {
    const userById = await user.getUserById(id);
    res.status(200).json(userById);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.post("/create", async (req, res) => {
  let firstName = xss(req.body.firstName);
  let lastName = xss(req.body.lastName);
  let email = xss(req.body.email);
  let password = xss(req.body.password);
  let gender = xss(req.body.gender);
  let role = xss(req.body.role);
  let age = xss(req.body.age);
  let userArray = [firstName, lastName, email, password, gender, role];
  try {
    errorHandler.checkIfElementsExists(userArray);
    errorHandler.checkIfElementsAreStrings(userArray);
    errorHandler.checkIfElementNotEmptyString(userArray);
    errorHandler.checkIfValidEmail(email);
    errorHandler.checkIfValidRole(role);
    errorHandler.checkIfValidAge(Number(age));
  } catch (e) {
    res.render("user/register", {
      title: "Register",
      error: e,
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const createUser = await user.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      Number(age),
      gender,
      role
    );

    let currentUser = await user.getUserByEmail(email);
    req.session.user = {
      id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
    };
    res.redirect("/feed");
    return;
  } catch (e) {
    res.render("user/register", {
      title: "Register",
      error: e,
    });
    return;
  }
});

router.post("/search", async (req, res) => {
  let firstName = xss(req.body.firstName);
  let lastName = xss(req.body.lastName);
  let fullName = [firstName, lastName];

  try {
    errorHandler.checkIfElementsExists(fullName);
    errorHandler.checkIfElementsAreStrings(fullName);
    errorHandler.checkIfElementNotEmptyString(fullName);
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }

  fullName = [firstName.toLowerCase(), lastName.toLowerCase()];

  try {
    const returnUser = await user.searchUsers(fullName[0], fullName[1]);
    res.status(200).json(returnUser);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.post("/login", async (req, res) => {
  let username = xss(req.body.email);
  let inputPassword = xss(req.body.password);
  let array = [username, inputPassword];
  try {
    errorHandler.checkIfElementsExists(array);
    errorHandler.checkIfElementsAreStrings(array);
    errorHandler.checkIfElementNotEmptyString(array);
    errorHandler.checkIfValidEmail(username);
  } catch (e) {
    res.json({
      auth: false,
      error: e,
    });
    return;
  }

  let match = false;
  let foundUser = null;
  try {
    foundUser = await user.getUserByEmail(username);
    match = await bcrypt.compare(inputPassword, foundUser.password);
  } catch (e) {
    res.json({
      auth: false,
      error: e,
    });
    return;
  }

  if (match) {
    req.session.user = {
      id: foundUser._id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
    };
    res.json({
      auth: true,
      user: req.session.user,
    });
    return;
  } else {
    res.json({
      auth: false,
      error: "Email or password is incorrect",
    });
    return;
  }
});

router.post("/addFriend/:id", async (req, res) => {
  let id = req.params.id;
  try {
    errorHandler.checkIfElementsExists([id]);
    errorHandler.checkIfElementsAreStrings([id]);
    errorHandler.checkIfElementNotEmptyString([id]);
    errorHandler.checkIfValidObjectId(id);
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }

  try {
    await user.addFriend(req.session.user.id, id);
    res.redirect("/user/profile/" + id);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

module.exports = router;
