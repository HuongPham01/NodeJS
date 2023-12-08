// import .env
// require("dotenv").config();
// express
const express = require("express");
// const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my project." });
});

require("./app/routes/user.routes.js")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/test.routes.js")(app);
require("./app/routes/product.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
