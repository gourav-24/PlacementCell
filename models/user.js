const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    sessionCookie: {
      type: String,
    },
  },
  { timeStamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
