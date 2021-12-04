//Require all modules
const express = require("express");
const public = express.static(__dirname + "/public");
const app = express();
const configRouter = require("./routes");
const exphbs = require("express-handlebars");
const session = require("express-session");

//Set up express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", public);

//Set up express session
app.use(
  session({
    name: "LoginCookie",
    secret: "Cookie used for login",
    saveUninitialized: true,
    resave: true,
  })
);

//Set up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/create", async (req, res, next) => {
  if (!req.session.user) {
    //Redirect to login page as user is not authorized to create venue
    return res.redirect("/user/login");
  } else {
    next();
  }
});

app.use("/venues/create", (req, res, next) => {
  console.log(req.method);
  req.method = "POST";
  next();
});

app.use("/feed/posts/create", (req, res, next) => {
  let user = req.session.user;
  if (!user) {
    //Redirect to login, for now its "/"
    return res.redirect("/user/login");
  }
  next();
});

//Configure app to the routes
configRouter(app);

//Set the port based on the environment or default to 3000
const PORT = process.env.PORT || 3000;

//Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
