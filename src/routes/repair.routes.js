const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const repairController = require("../controllers/repair.controller");

router.use(authMiddleware);

// Creează un log de reparație
router.post("/", repairController.createRepairLog);

// Obține toate reparațiile pentru o mașină
router.get("/:carId", repairController.getRepairLogs);

// Șterge un log de reparație
router.delete("/:id", repairController.deleteRepairLog);

module.exports = router;
