const express = require("express");
const app = express();
const Port = process.env.PORT || 8000;
const path = require("path");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportLoacal = require("./config/passport-local-strategy");
const flash = require("connect-flash");
//const MongoStore = require('connect-mongo')(session);
//const bodyParser = require("body-parser");

// using parser
app.use(express.urlencoded({ extended: false }));

// cookie
app.use(cookieParser());

//using static files
app.use(express.static("./assets"));

// use flash for faliure messages
app.use(flash());
// view
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// express-session
app.use(
  session({
    name: "PlacementCell",
    secret: "@NcRfUjX",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);

// initializing passport and its session
app.use(passport.initialize());
app.use(passport.session());
app.use(passportLoacal.setAuthenticatedUser);

// routes
app.use("/", require("./routes/index"));

//Start server
app.listen(Port, function (err) {
  if (err) {
    console.log("Error while starting the server: " + err);
    return;
  }

  console.log("Server is started and listning on Port: " + Port);
});
