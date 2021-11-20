const venues = require("./venues");
const user = require("./user");
const reviews = require("./reviews");

const constructorMethod = (app) => {
  app.use("/venues", venues);
  app.use("/user", user);
  app.use("/reviews", reviews);
  app.use("*", (req, res) => {
    res.status(404).json({ err: "Route not found" });
  });
};

module.exports = constructorMethod;
