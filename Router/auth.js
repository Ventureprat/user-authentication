const express = require("express");
const router = express.Router();

router.use(express.json());

const bcrypt = require("bcrypt");

//Model Import
const authModel = require("../Model/authModel");

const passHash = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePass = (password, matchedPass) => {
  return bcrypt.compareSync(password, matchedPass);
};

router.get("/", (req, res) => {
  res.json({ text: "Welcome to the auth Page" });
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPass = passHash(password);
  const newUser = new authModel({
    email: email,
    password: hashedPass,
  });

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
      const passVerify = comparePass(password, data[0].password);
      if (passVerify == true) {
        res.json({
          text: "Login Successful",
          data: data,
        });
      } else {
        res.json({
          text: "Invalid Password",
        });
      }
    }
  });
});

module.exports = router;
