const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
require("dotenv/config");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.removeHeader("x-powered-by");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

//import modules
const auth = require("./Router/auth");

//Template Engine
app.set("view engine", "ejs");

//routers
app.use("/auth", auth);

mongoose.connect("mongodb://localhost:27017/authDB", () => {
  console.log("Database Connected...");
});

app.get("/", (req, res) => {
  res.render("index", { data: { page: "Home Page" } });
});
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.listen(3000, () => console.log("Server Started..."));
