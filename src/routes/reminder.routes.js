const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const reminderController = require("../controllers/reminder.controller");

router.use(authMiddleware);

router.post("/", reminderController.createReminder);
router.get("/:carId", reminderController.getRemindersForCar);
router.put("/:id", reminderController.updateReminder);
router.delete("/:id", reminderController.deleteReminder);

module.exports = router;
