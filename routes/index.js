const venues = require("./venues");
const user = require("./user");
const landing = require("./landing");
const gameReq = require("./request");
const create = require("./create");

const constructorMethod = (app) => {
  app.use("/", landing);
  app.use("/venues", venues);
  app.use("/create", create);
  app.use("/post", gameReq);
  app.use("/user", user);
  app.use("*", (req, res) => {
    res.status(404).redirect("/");
  });
};

module.exports = constructorMethod;
