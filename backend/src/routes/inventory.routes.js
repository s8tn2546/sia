const express = require("express");
const controller = require("../controllers/inventory.controller");

const router = express.Router();

router.get("/", controller.getInventory);
router.post("/", controller.postInventory);

module.exports = router;
