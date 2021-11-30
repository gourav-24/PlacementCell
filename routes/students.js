const express = require("express");
const router = express.Router();
const studentsCon = require("../controllers/StudentController");

router.get("/", studentsCon.home);
router.post("/create", studentsCon.create);
router.get("/delete/", studentsCon.delete);
router.post("/update", studentsCon.update);

module.exports = router;
