const mongoose = require("mongoose");

const googleUserSign = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  // 2 roles - admin & basic
  role: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("googleUserSign", googleUserSign);
