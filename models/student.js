const mongoose = require("mongoose");
const studentSchema = mongoose.Schema(
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
    college: {
      type: String,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "batch",
    },
    status: {
      type: String,
    },
    WebDscore: {
      type: Number,
      default: 0,
    },
    DSAscore: {
      type: Number,
      default: 0,
    },
    ReactScore: {
      type: Number,
      default: 0,
    },
    InterviewList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"interview",
      }
    ],
  },
  { timeStamp: true }
);

const student = mongoose.model("student", studentSchema);
module.exports = student;
