// Import required modules
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config();

const port = process.env.PORT || 3000;

// Create Express app
const app = express();
// define the schema
const Schema = mongoose.Schema;
//connect to the database  mongodb

mongoose.connect("mongodb://127.0.0.1:27017/assignment", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to db", err);
  });

// Set up Handlebars as the template engine
app.engine(".handlebars", exphbs());
app.set("view engine", ".handlebars");
app.set("views", path.join(__dirname, "views"));

// Define a route for the homepage
app.get("/", (req, res) => {
  res.render("app");
});

// set the username and password

const userSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
});
const User = mongoose.model("User", userSchema);

app.post("/users", (req, res) => {
  const { name, age, email } = req.body;

  const newUser = new User({
    name,
    age,
    email,
  });

  newUser
    .save()
    .then(() => {
      res.status(201).json({ message: "User saved successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error saving user" });
    });
});

//   endpoint for updating a user profile
app.put("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const { name, age, email } = req.body;

  User.findByIdAndUpdate(userId, { name, age, email })
    .then(() => {
      res.status(200).json({ message: "User updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error updating user" });
    });
});

//   the endpoint for viewing a user profile

app.get("/users/:userId", (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(user);
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Error retrieving user" });
    });
});

//   the endpoint for deleting a user profile

app.delete("/users/:userId", (req, res) => {
  const { userId } = req.params;

  User.findByIdAndRemove(userId)
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error deleting user" });
    });
});

// Start the server
app.listen(port, () => {
  console.log("Server is running on http://localhost:3000");
});
