const express = require("express");
const passport = require("passport");
const router = express.Router();
const usersController = require("../controllers/userController");
router.get("/signup", usersController.SignUp);
router.get("/signin", usersController.SignIn);
router.post("/create", usersController.create);
router.get("/sign-out", usersController.destroySession);
router.post(
  "/createSesssion",
  passport.authenticate("local", {
    faliureFlash: true,

    failureRedirect: "/users/signin",
  }),
  usersController.createSesssion
);
module.exports = router;
