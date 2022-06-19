const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const tokenAuth = require("../Middlewares/tokenAuth");
const { roleAdmin, roleBasic } = require("../Middlewares/roleAuthorization");

const bcrypt = require("bcrypt");

//Model Import
const authModel = require("../Model/authModel");

router.get("/", (req, res) => {
  res.json({ text: "Welcome to the auth Page" });
});

router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;
  if (email == "" || password == "" || role == "") {
    res.status(401).json("Please fill the fields correctly");
  } else {
    const hashedPass = bcrypt.hashSync(password, 10);
    const newUser = new authModel({
      email: email,
      password: hashedPass,
      role: role,
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
        res.cookie("token", savedData.token, { httpOnly: true });
        res.json({
          text: "Success",
          data: savedData,
        });
      }
    });
  }
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
            role: data[0].role,
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

//routers to test authorization

router.get("/users", tokenAuth, roleAdmin, async (req, res) => {
  const { userId } = req.user;
  authModel.find({ _id: userId }).exec(function (err, data) {
    if (err) res.send(err);
    else {
      res.json(data);
    }
  });
});

router.get("/basicUser", tokenAuth, roleBasic, async (req, res) => {
  res.json({ text: "Welcome basic-User/Admin" });
});

module.exports = router;
