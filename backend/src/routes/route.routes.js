const express = require("express");
const controller = require("../controllers/route.controller");

const router = express.Router();

router.post("/", controller.postRoutes);

module.exports = router;
