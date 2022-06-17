const authModel = require("../Model/authModel");

const roleAdmin = (req, res, next) => {
  const { userId } = req.user;

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
};

const roleBasic = async (req, res, next) => {
  const { userId } = req.user;

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
};

module.exports = { roleAdmin, roleBasic };
