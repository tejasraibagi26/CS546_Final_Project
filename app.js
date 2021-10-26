const express = require("express");
const app = express();
const configRouter = require("./routes");

app.use(express.json());
configRouter(app);

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
