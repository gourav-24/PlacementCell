const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// authenticate using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true, // this helps us to pass any messages to req by accessing req variable
    },
    function (req, email, password, done) {
      // find the user and establish the identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log("error in finding the user in passport");
          return done(err);
        }

        if (!user) {
          console.log("Invalid email");
          return done(
            null,
            false,
            req.flash("error", `Email: ${email} not found`)
          );
        }

        if (user.password != password) {
          console.log("password dont match");
          return done(null, false, req.flash("error", "Password incorrect"));
        }

        return done(null, user, req.flash("success", "Succesfully Logged In"));
      });
    }
  )
);

// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id); // automatically encrypts in the cookie
});

//Deserializing the user from the key in the cookie
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("error in finding the user in passport");
      return done(err);
    }

    return done(null, user);
  });
});

// check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user; // putting it here sets user only when check authentication is called
    // this method is provided by passport
    return next();
  }
  // if the user is not signed in
  console.log("redirect at 60 of passport");
  let errors = req.flash().error || [];
  return res.redirect("/users/signin");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};
module.exports = passport;
