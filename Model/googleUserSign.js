const mongoose = require("mongoose");

const googleUserSign = new mongoose.Schema({
  googleId: {
    type: String,
  },
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
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
});

module.exports = mongoose.model("googleUserSign", googleUserSign);
