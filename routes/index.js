const constructorMethod = (app) => {
  app.use("*", (req, res) => {
    res.status(404).json({ err: "Route not found" });
  });
};

module.exports = constructorMethod;
