const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const app = express();

// app.use("/images", express.static(path.join(__dirname, "/images")));

// Middlewares
app.use(cors({ origin: "*" }));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/properties", propertyRoutes);

// app.use(express.static(path.join(__dirname, "/frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/frontend/build", "index.html"));
// });
app.get("*", (req, res) => {
  res.send("Welcome to realestate app 😍");
});
module.exports = app;
