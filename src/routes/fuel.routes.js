const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const fuelController = require("../controllers/fuel.controller");

router.post("/", authenticate, fuelController.createFuelLog);
router.get("/", authenticate, fuelController.getAllFuelLogs);
router.get("/:carId", authenticate, fuelController.getFuelLogs);
router.delete("/:id", authenticate, fuelController.deleteFuelLog);

module.exports = router;
