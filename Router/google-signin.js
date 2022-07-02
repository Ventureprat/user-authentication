const express = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const { google } = require("googleapis");
const router = express.Router();
// const passport = require("passport");
// const urlParse = require("url-parse");
const queryString = require("query-string");
const axios = require("axios");

//User model
const googleUserSignModel = require("../Model/googleUserSign");

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
  prompt: "consent",
  scope: scopes,
});

let userCredential = null;

router.get("/auth/google", (req, res) => {
  res.redirect(authorizationUrl);
});

const googleUserFunc = (tokens) => {
  return axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.message);
    });
};

router.get("/auth/google/callback", async (req, res) => {
  let q = queryString.parseUrl(req.url).query;
  if (q.error) {
    throw new Error(q.error);
  } else {
    let { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);

    userCredential = tokens;

    const { id, email } = await googleUserFunc(tokens);

    await googleUserSignModel.find({ googleId: id }).exec(function (err, data) {
      if (err) {
        throw new Error(err);
      } else if (data.length == 0) {
        const newUserGoogleSign = new googleUserSignModel({
          googleId: id,
          email: email,
          role: "basic",
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });

        newUserGoogleSign.save(function (err, data) {
          if (err) {
            throw new Error(err.message);
          } else {
            res.json({
              text: "Google Sign-in Successful",
              data: data,
            });
          }
        });
      } else {
        console.log;
        googleUserSignModel.updateMany(
          { googleId: id },
          {
            $set: {
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
            },
          },
          function (err, data) {
            if (err) {
              throw new Error(err);
            } else {
              res.json({
                text: "User Already registered.Tokens Updated",
                dataLogs: data,
              });
            }
          }
        );
      }
    });
  }
});

module.exports = router;
