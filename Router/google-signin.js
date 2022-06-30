const express = require("express");
const { google } = require("googleapis");
const router = express.Router();
const passport = require("passport");
const urlParse = require("url-parse");
const queryString = require("query-string");

//User model
// const googleUserSign = require("../Model/googleUserSign");

// const GoogleStrategy = require("passport-google-oauth2").Strategy;

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/callback",
//       passReqToCallback: true,
//     },
//     function (request, accessToken, refreshToken, profile, done) {
//       //if user found update accesstoken and if not found create user

//       const userCheck = googleUserSign.findOne({
//         _id: profile.id,
//         email: profile.email,
//       });

//       if (userCheck) {
//       } else {
//         const newUser = new googleUserSign({
//           _id: profile.id,
//           email: profile.email,
//           role: basic,
//           token: accessToken,
//         });

//         newUser.save(function (err, data) {
//           if (err) {
//             return done(err);
//           } else {
//             return done(data);
//           }
//         });
//       }
//     }
//   )
// );

// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/auth/google/success",
//     failureRedirect: "/auth/google/failure",
//   })
// );

// router.get("/google/success", (req, res) => {
//   res.json(accessToken);
// });
// router.get("/google/failure", (req, res) => {
//   res.json(accessToken);
// });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

let userCredential = null;

router.get("/auth/google", (req, res) => {
  res.redirect(authorizationUrl);
});

router.get("/auth/google/callback", async (req, res) => {
  let q = queryString.parseUrl(req.url).query;

  if (q.error) {
    console.log("Error:" + q.error);
  } else {
    let { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);

    userCredential = tokens;
    res.json({
      token: userCredential,
    });
  }
});

module.exports = router;
