//Require all modules
const express = require("express");
const public = express.static(__dirname + "/public");
const app = express();
const configRouter = require("./routes");
const exphbs = require("express-handlebars");

//Set up express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", public);

//Set up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Configure app to the routes
configRouter(app);

//Set the port based on the environment or default to 3000
const PORT = process.env.PORT || 3000;

//Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
