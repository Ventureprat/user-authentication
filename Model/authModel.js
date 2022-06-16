const mongoose = require("mongoose");

const authModel = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("authModel", authModel);
