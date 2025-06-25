const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const repairController = require("../controllers/repair.controller");

// Creează un log de reparație
router.post("/", authenticate, repairController.createRepairLog);

// Obține toate reparațiile pentru o mașină
router.get("/:carId", authenticate, repairController.getRepairLogs);

// Obține toate reparațiile pentru utilizator
router.get("/all", authenticate, repairController.getAllRepairLogs);

// Șterge un log de reparație
router.delete("/:id", authenticate, repairController.deleteRepairLog);

module.exports = router;
