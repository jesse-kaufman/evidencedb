// Server

// Enviroment variables
require("dotenv").config();

// MongoDB connection
const connectDB = require("./utils/db");
connectDB();

// Setup Express
const express = require("express");
const app = express();

// Cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Express Validator
//const { check } = require('express-validator');

// Enable compression
const compression = require("compression");
app.use(compression());

// Interpret responses as JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Use CORS
const cors = require("cors");
app.use(cors());

// Models
const Contacts = require("./models/contactModel");

// Static routes
app.use("/public", express.static("public"));

// User routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/routes", userRoutes);

// Contact routes
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contacts", contactRoutes);

// Start the server
const server = app.listen(8080, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
