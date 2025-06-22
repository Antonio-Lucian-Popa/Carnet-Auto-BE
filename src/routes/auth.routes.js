const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Rute clasice
router.post("/register", authController.register);
router.post("/login", authController.login);

// În viitor: Google Auth
// router.get("/google", passport.authenticate(...))

module.exports = router;
