const express = require("express");
const router = express.Router();
const interviewCon = require("../controllers/InterviewController");

router.get("/", interviewCon.home);
router.post("/create", interviewCon.create);
router.post("/add", interviewCon.add);
router.get("/delete/", interviewCon.delete);
router.get("/detail/", interviewCon.detail);
router.post("/removeStudent", interviewCon.removeStudent);
router.get("/updateResult/", interviewCon.Result);
router.get("/exportCSV", interviewCon.exportCSV);
router.post("/updateResult", interviewCon.updateResult);

module.exports = router;
