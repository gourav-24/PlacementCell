const Batch = require("../models/batch");
const customMWare = require("../config/middleware");
const Interview = require("../models/interviews");

// renders home page
module.exports.home = async function (req, res, next) {
  try {
    if (req.isAuthenticated()) {
      let batchList = await Batch.find({});
      let todayDate = new Date();
      let interviewList = await Interview.find({}).lean();
      let todayInterview = [];
      for (let val of interviewList) {
        if (val.interviewDate.toDateString() === todayDate.toDateString()) {
          val.interviewDate = val.interviewDate.toDateString();
          todayInterview.push(val);
        }
      }
      customMWare.setFlash(req, res, next);
      return res.render("Home", {
        batchData: batchList,
        todayInterviewList: todayInterview,
      });
    }

    return res.redirect("/users/signin");
  } catch (err) {
    console.log("Error in home controller: " + err);
  }
};

// creates a new batch
module.exports.createBatch = async function (req, res, next) {
  try {
    if (req.body.batchName || req.body.batchName.trim() === "") {
      req.flash("error", "Batch name can't be empty");
      let batchList = await Batch.find({});
      customMWare.setFlash(req, res, next);
      return res.render("Home", {
        batchData: batchList,
      });
    }

    let batch = await Batch.findOne({ batchName: req.body.batchName });

    if (!batch) {
      Batch.create(req.body, function (err, batch) {
        if (err) {
          console.log("Error in creating batch: ", err);
          return;
        }
        console.log(batch);
      });
    }
    return res.redirect("/");
  } catch (err) {
    console.log("Error in createBatch controller: " + err);
  }
};
