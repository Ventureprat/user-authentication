const jwt = require("jsonwebtoken");

const tokenAuth = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.cookies.token;

  if (!token) {
    res.status(403).send("An Authentication Token Is Required");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    return next();
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
};

module.exports = tokenAuth;
