const venues = require("./venues");
const landing = require("./landing");

const constructorMethod = (app) => {
  app.use("/", landing);
  app.use("/venues", venues);
  app.use("*", (req, res) => {
    res.status(404).redirect("/");
  });
};

module.exports = constructorMethod;
