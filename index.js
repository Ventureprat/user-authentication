const http = require("http");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({ text: "Hii" });
});

app.listen(3000, () => console.log("Server Started..."));
