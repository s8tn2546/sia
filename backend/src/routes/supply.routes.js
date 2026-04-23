const express = require("express");
const controller = require("../controllers/supply.controller");

const router = express.Router();

router.post("/", controller.postSupply);

module.exports = router;
