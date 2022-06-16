const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const tokenAuth = require("../Middlewares/tokenAuth");

const bcrypt = require("bcrypt");

//Model Import
const authModel = require("../Model/authModel");

router.get("/", (req, res) => {
  res.json({ text: "Welcome to the auth Page" });
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPass = bcrypt.hashSync(password, 10);
  const newUser = new authModel({
    email: email,
    password: hashedPass,
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  newUser.token = token;

  await newUser.save((err, savedData) => {
    if (err) {
      res.json({
        error: err,
      });
    } else {
      res.json({
        text: "Success",
        data: savedData,
      });
    }
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  authModel.find({ email: email }).exec(async function (err, data) {
    if (err) {
      res.status(200).json({
        text: err,
      });
    } else if (data.length == 0) {
      res.status(200).json({
        text: "User Not Found",
      });
    } else {
      const token = jwt.sign({ userId: data[0]._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      await authModel.findByIdAndUpdate(data[0]._id, { token });

      const passVerify = bcrypt.compareSync(password, data[0].password);

      if (passVerify == true) {
        res.status(200).json({
          text: "Login Successful",
          data: {
            email: data[0].email,
            password: data[0].password,
            token: token,
          },
        });
      } else {
        res.json({
          text: "Invalid Password",
        });
      }
    }
  });
});

router.get("/users", tokenAuth, async (req, res) => {
  authModel.find({}).exec(function (err, data) {
    if (err) res.send(err);
    else {
      res.json(req.user);
    }
  });
});

module.exports = router;
