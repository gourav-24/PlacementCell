const Student = require("../models/student");
const Batch = require("../models/batch");
const Result = require("../models/result");
const Interview = require("../models/interviews");

// display all the students on students page
module.exports.home = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }

    let studentList = await Student.find({}).populate({
      path: "batch",
      select: "batchName",
    });
    let batchList = await Batch.find({});

    return res.render("Students", {
      studentData: studentList,
      batchData: batchList,
    });
  } catch (err) {
    console.log("Error in interview controller: " + err);
  }
};

// create a new student
module.exports.create = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }

    // check if student exists
    let student = await Student.findOne({ email: req.body.email });

    if (!student) {
      // if student dont exist create one
      Student.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in creating user: " + err);
        }
        return;
      });
      return res.send({ message: "User Created" });
    } else {
      return res.send({ userFound: true, email: student.email });
    }
  } catch (err) {
    console.log("Error in student controller: " + err);
  }
};

// delete student
module.exports.delete = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }

    // delete all results related to this student
    await Result.deleteMany({ student: req.query.id });

    // delete student
    let studentRec = await Student.findByIdAndDelete({
      _id: req.query.id,
    });

    // remove student id from the interview student list
    if (studentRec && studentRec.InterviewList.length > 0) {
      let interviewList = await Interview.find({
        _id: { $in: studentRec.InterviewList },
      });
      interviewList.forEach((interview) => {
        let ind = interview.StudentList.indexOf(studentRec._id);
        interview.StudentList.splice(ind, 1);
        interview.save();
      });
      //interviewList.save();
    }

    return res.redirect("back");
  } catch (err) {
    console.log("Error in interview controller: " + err);
  }
};

// update the changes done in student record
module.exports.update = async function (req, res) {
  try {
    let studentRec = await Student.findById({ _id: req.body.studentId });
    if (studentRec) {
      for (let key in req.body) {
        if (key !== "studentId" && studentRec[key] !== req.body[key].trim()) {
          studentRec[key] = req.body[key].trim();
        }
      }
      studentRec.save();
    }
    return res.send("changes made");
  } catch (err) {
    console.log("Error in interview controller: " + err);
  }
};
