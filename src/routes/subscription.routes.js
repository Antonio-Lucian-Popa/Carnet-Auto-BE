const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const controller = require("../controllers/subscription.controller");

router.use(authMiddleware);

router.get("/plans", controller.getPlans);
router.post("/checkout", controller.createStripeCheckout);

module.exports = router;
