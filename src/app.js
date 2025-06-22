const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const carRoutes = require("./routes/car.routes");
const fuelRoutes = require("./routes/fuel.routes");
const repairRoutes = require("./routes/repair.routes");
const reminderRoutes = require("./routes/reminder.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const stripeWebhook = require("./routes/stripe.webhook");

const app = express();

// Webhook Stripe – trebuie declarat înainte de `express.json()`
app.use("/api/stripe", stripeWebhook);

// Restul middlewares
app.use(cors());
app.use(express.json()); // ✅ acum e safe de pus
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Rute
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/repair", repairRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Test
app.get("/", (req, res) => {
  res.send("✅ CarnetAuto backend is running");
});

module.exports = app;
