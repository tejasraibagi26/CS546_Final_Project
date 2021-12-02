const venues = require("./venues");
const user = require("./user");
const reviews = require("./reviews");
const landing = require("./landing");
const gameReq = require("./request");
const create = require("./create");
const admin = require("./admin");
const notFound = require("./404");

const constructorMethod = (app) => {
  app.use("/", landing);
  app.use("/venues", venues);
  app.use("/create", create);
  app.use("/post", gameReq);
  app.use("/user", user);
  app.use("/reviews", reviews);
  app.use("/admin", admin);
  app.use("/404", notFound);
  app.use("*", (req, res) => {
    res.status(404).redirect("/404");
  });
};

module.exports = constructorMethod;
