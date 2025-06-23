const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const passport = require("passport");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret456"; // fallback dacă .env lipsește


// Rute clasice
router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Trimite token JWT către frontend după login
    const token = jwt.sign({ userId: req.user.id, email: req.user.email }, JWT_SECRET, {
      expiresIn: "2d",
    });

    res.redirect(`${process.env.CLIENT_URL}/login/success?token=${token}`);
  }
);

// În viitor: Google Auth
// router.get("/google", passport.authenticate(...))

module.exports = router;
