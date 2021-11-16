const express = require("express");
const { user } = require("../data");
const router = express.Router();
const data = require("../data");
const errorHandler = require("../Errors/errorHandler");
const user = data.user;
const bcrypt = require("bcrypt");
const saltRounds = 16;

router.get("/", async (req, res) => {
  try {
    const users = await user.getAllUsers();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ err: e });
  }
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
  let inputUser = req.body;
  let userArray = [
    inputUser.firstName,
    inputUser.lastName,
    inputUser.email,
    inputUser.password,
    inputUser.gender,
    inputUser.role,
  ];
  try {
    errorHandler.checkIfElementsExists(userArray);
    errorHandler.checkIfElementsAreStrings(userArray);
    errorHandler.checkIfElementNotEmptyString(userArray);
    errorHandler.checkIfValidEmail(inputUser.email);
    errorHandler.checkIfValidRole(inputUser.role);
    errorHandler.checkIfValidAge(inputUser.age);
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }

  const password = await bcrypt.hash(inputUser.password, saltRounds);

  try {
    const createUser = await user.createUser(
      inputUser.firstName,
      inputUser.lastName,
      inputUser.email,
      password,
      inputUser.age,
      inputUser.gender,
      inputUser.role
    );

    res.status(200).json(createUser);
  } catch (e) {
    res.status(500).json({ err: e });
  }
});

router.post("/search", async (req, res) => {
  let inputName = req.body;
  let fullName = [inputName.firstName, inputName.lastName];

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
  let username = req.body.email;
  let inputPassword = req.body.password;

  try {
    const foundUser = await user.getUserByEmail(username);
  } catch (e) {
    res.status(401).json({ err: e });
    return;
  }

  try {
    match = await bcrypt.compare(inputPassword, foundUser.password);
  } catch (e) {
    res.status(500).json({ err: e });
    return;
  }

  if (match) {
    res.status(200).json({ login: "Success" });
    return;
  } else {
    res.status(401).json({ login: "Failure" });
    return;
  }
});

module.exports = router;
