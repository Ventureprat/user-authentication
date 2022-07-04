const authModel = require("../Model/authModel");
const googleUserSign = require("../Model/googleUserSign");

const roleAdmin = (req, res, next) => {
  const { userId, googleId } = req.user;

  //google signed in users are always basic users.

  if (googleId) {
    // googleUserSign.findOne({ googleId: googleId }).exec(function (err, data) {
    //   if (err) {
    //     throw new Error(err);
    //   } else {
    //     if (data.role === "admin") {
    //       return next();
    //     } else {
    //       res.status(403).send("Unauthorized Access");
    //     }
    //   }
    // });
    res.status(403).send("Unauthorized Access");
  } else if (userId) {
    authModel.find({ _id: userId }).exec(function (err, data) {
      if (err) {
        res.json(err);
      } else {
        if (data[0].role === "admin") {
          return next();
        } else {
          res.status(403).send("Unauthorized Access");
        }
      }
    });
  }
};

const roleBasic = async (req, res, next) => {
  const { userId, googleId } = req.user;

  if (googleId) {
    await googleUserSign.findOne({ googleId: googleId }).exec((err, data) => {
      if (err) {
        throw new Error(err);
      } else {
        if (data.role === "admin" || data.role === "basic") {
          return next();
        } else {
          res.status(403).send("Unauthorized Access");
        }
      }
    });
  } else if (userId) {
    await authModel.find({ _id: userId }).exec(function (err, data) {
      if (err) {
        res.json(err);
      } else {
        if (data[0].role === "admin" || data[0].role === "basic") {
          return next();
        } else {
          res.status(403).send("Unauthorized Access");
        }
      }
    });
  }
};

module.exports = { roleAdmin, roleBasic };
