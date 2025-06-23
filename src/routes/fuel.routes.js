const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const fuelController = require("../controllers/fuel.controller");

router.use(authMiddleware);

router.post("/", fuelController.createFuelLog);
router.get("/", fuelController.getAllFuelLogs);
router.get("/:carId", fuelController.getFuelLogs);
router.delete("/:id", fuelController.deleteFuelLog);

module.exports = router;
