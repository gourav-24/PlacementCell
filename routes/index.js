const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.use("/users", require("./users"));
router.use("/interviews", require("./interviews"));
router.use("/students", require("./students"));
router.get("/", homeController.home);
router.post("/create-batch", homeController.createBatch);

module.exports = router;
