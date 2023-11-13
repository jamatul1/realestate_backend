const mongoose = require("mongoose");
const app = require("../app");

// ** Dotenv Configuration
require("dotenv").config();

//***---------------- Connecting to the Database ----------------------***
const dbUrl = process.env.MONGO_URL;
console.log(dbUrl);
mongoose.connect(dbUrl, function (error) {
  if (!error) {
    console.log("Database is connected successfully.");
  } else {
    console.log("Database connection failed with error : ", error);
  }
});

// ***--------------- Server is listening here -----------------------***
port = process.env.PORT || 8000;
app.listen(port, (error) => {
  if (!error) {
    console.log("Server is listening at Port : ", port);
  }
});
