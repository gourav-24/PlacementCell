const Student = require("../models/student");
const Interview = require("../models/interviews");
const Result = require("../models/result");
const metaData = require("../config/metaData");

//interview list and form page
module.exports.home = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }
    let studentList = await Student.find({});
    let InterviewList = await Interview.find({}).lean();

    //convert Date to a format
    InterviewList.forEach((obj) => {
      obj.interviewDate = obj.interviewDate.toDateString();
    });

    return res.render("Interviews", {
      studentData: studentList,
      interviewData: InterviewList,
    });
  } catch (err) {
    console.log("Error in interview controller: " + err);
  }
};

// Create Interview
module.exports.create = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }

    var interview = await Interview.findOne({
      company: req.body.company,
    });

    if (!interview) {
      // create Interview rec
      console.log("user not found");
      await Interview.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in creating Interview: " + err);
        }
        return;
      });
      return res.send({ message: "Interview Created" });
    } else {
      return res.send({ userFound: true, email: null });
    }
  } catch (err) {
    console.log("Error in interview controller: " + err);
  }
};

// delete interview record
module.exports.delete = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }

    let interviewRec = await Interview.findByIdAndDelete({
      _id: req.query.id,
    });

    // remove interview record from related students interviewlist
    let studentList = await Student.find({
      _id: { $in: interviewRec.StudentList },
    });
    if (studentList && studentList.length > 0) {
      studentList.forEach((student) => {
        student.InterviewList.pull(interviewRec._id);
        student.save();
      });
    }
    //delete result too
    await Result.deleteMany({
      $and: [
        { interview: interviewRec._id },
        { student: { $in: interviewRec.StudentList } },
      ],
    });

    return res.redirect("back");
  } catch (err) {
    console.log("Error in interview controller: " + err);
  }
};

/* fetch interview detail including students that can be added to interview 
and students which are already in interview student list*/
module.exports.detail = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }
    console.log("resultPicklist>>", metaData);
    console.log(req.query.id);
    let interviewRec = await Interview.findById({ _id: req.query.id })
      .populate({
        path: "StudentList",
        select: "firstName lastName",
      })
      .lean();
    // fetch result list while checking student id and interview id and map result with student

    console.log("test>>", interviewRec);
    console.log("string: ", interviewRec.interviewDate.toDateString());
    interviewRec.interviewDate = interviewRec.interviewDate.toDateString();

    if (interviewRec) {
      let studentList = await Student.find({
        _id: { $nin: interviewRec.StudentList },
      });

      let ResultList = await Result.find({
        $and: [
          { student: { $in: interviewRec.StudentList } },
          { interview: interviewRec._id },
        ],
      })
        .populate({
          path: "student",
          select: "firstName lastName",
        })
        .populate({
          path: "interview",
          select: "company",
        });

      return res.render("interviewDetail", {
        interviewData: interviewRec,
        studentData: studentList,
        resultData: ResultList,
        resultPicklistData: metaData.resultPicklist,
      });
    }
    return res.redirect("back");
  } catch (err) {
    console.log("Error in detail fn of interview controller: ", err);
  }
};

// add student in interview student list
module.exports.add = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }

    // add student in interview list
    if (
      req.body.id &&
      req.body.id !== "" &&
      req.body.student &&
      req.body.student != ""
    ) {
      let interviewRec = await Interview.findById({ _id: req.body.id });
      if (interviewRec) {
        let result = await Result.create(
          {
            student: req.body.student,
            interview: req.body.id,
          },
          function (err, result) {
            if (err) {
              console.log("Error in creating result ", err);
              return;
            }
          }
        );
        interviewRec.StudentList.push(req.body.student);
        interviewRec.save();

        // add interview in student list
        let studentRec = await Student.findById({ _id: req.body.student });
        if (studentRec) {
          studentRec.InterviewList.push(interviewRec._id);
          studentRec.save();
        }

        return res.send("Student Added");
      }
    }

    return res.send("kindly select Student");
  } catch (err) {
    console.log("Error in adding student ", err);
  }
};

// remove student from an interview
module.exports.removeStudent = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }

    // remove student from studentList of interview
    let interviewRec = await Interview.findById({ _id: req.body.interviewID });
    if (interviewRec) {
      let resultRec = await Result.findOneAndDelete({
        _id: req.body.resultID,
      });
      let ind = interviewRec.StudentList.indexOf(resultRec.student);
      interviewRec.StudentList.splice(ind, 1);
      interviewRec.save();

      // remove interview from students interview list
      let studentRec = await Student.findById({ _id: resultRec.student });
      if (studentRec) {
        let studentInd = studentRec.InterviewList.indexOf(interviewRec._id);
        studentRec.InterviewList.splice(studentInd, 1);
        studentRec.save();
      }

      return res.send("student removed");
    }

    return res.redirect("back");
  } catch (err) {
    console.log("Error in removeStudent fn of interview controller ", err);
  }
};

module.exports.Result = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }
    let resultRec = await Result.findOne({
      interview: req.query.interview,
      student: req.query.student,
    })
      .populate({
        path: "student",
        select: "firstName lastName",
      })
      .populate({
        path: "interview",
        select: "company interviewDate",
      });
    if (resultRec) {
      return res.render("updateResult", {
        resultData: resultRec,
      });
    }
    return res.redirect("back");
  } catch (err) {
    console.log("Error in updateResult fn of interview controller ", err);
  }
};

// update result
module.exports.updateResult = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }

    let resultRec = await Result.findOne({ _id: req.body.resultId });
    if (resultRec) {
      resultRec.result = req.body.pickListVal;
      resultRec.save();
    }
    return res.send("result updated");
  } catch (err) {
    console.log("error while updating result ", err);
  }
};

//export data
module.exports.exportCSV = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/signin");
    }

    let resultList = await Result.find({})
      .populate({
        path: "student",
        select:
          "firstName lastName email college batch status WebDscore DSAscore ReactScore",
        populate: {
          path: "batch",
        },
      })
      .populate({
        path: "interview",
        select: "company interviewDate",
      });
    let rec = resultList[0];
    console.log("rec>> ", rec.student.batch);

    return res.send(JSON.stringify(resultList));
  } catch (err) {
    console.log("Error in exportCSV controller: " + err);
  }
};
