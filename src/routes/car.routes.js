const express = require("express");
const router = express.Router();
const carController = require("../controllers/car.controller");
const authenticate = require("../middlewares/auth.middleware");

router.post("/", authenticate, carController.addCar);
router.get("/", authenticate, carController.getUserCars);
router.delete("/:id", authenticate, carController.deleteCar);

module.exports = router;
