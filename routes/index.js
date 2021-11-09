const venues = require("./venues");

const constructorMethod = (app) => {
  app.use("/venues", venues);
  app.use("*", (req, res) => {
    res.status(404).json({ err: "Route not found" });
  });
};

module.exports = constructorMethod;
