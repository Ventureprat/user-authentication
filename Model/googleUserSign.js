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
  token: {
    type: mongoose.Schema.Types.Mixed,
  },
  jwtToken: {
    type: String,
  },
});

module.exports = mongoose.model("googleUserSign", googleUserSign);
