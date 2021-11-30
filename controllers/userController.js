const User = require("../models/user");
const customMWare = require("../config/middleware");

// open sign up page
module.exports.SignUp = function (req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }

    return res.render("Signup");
  } catch (err) {
    console.log("Error in signup controller: " + err);
  }
};

// open sign in page
module.exports.SignIn = function (req, res, next) {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    console.log("SignIn controller loaded");

    customMWare.setFlash(req, res, next);
    return res.render("SignIn");
  } catch (err) {
    console.log("Error in signIn controller: " + err);
  }
};

// create a new user
module.exports.create = async function (req, res) {
  try {
    if (req.body.password === req.body.confirmPass) {
      let user = await User.findOne({ email: req.body.email });

      if (!user) {
        // create user
        console.log("user not found");
        User.create(req.body, function (err, user) {
          if (err) {
            console.log("Error in creating user: " + err);
          }
          return;
        });
        return res.redirect("SignIn");
      } else {
        console.log("user found");
        return res.send({ userFound: true, email: user.email });
      }
    }
  } catch (err) {
    console.log("Error in signup controller: " + err);
    return;
  }
};

// create new session if user have passed passport verification
module.exports.createSesssion = async function (req, res) {
  try {
    return res.redirect("/");
  } catch (err) {
    console.log("Error in create Session controller of userController: ", err);
  }
};

// destroy the user session
module.exports.destroySession = function (req, res) {
  try {
    console.log(">>>>> ", req.locals);
    req.logout();
    return res.redirect("/");
  } catch (err) {
    console.log("Error in destroy session", err);
  }
};
