const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const carRoutes = require("./routes/car.routes");
const fuelRoutes = require("./routes/fuel.routes");
const repairRoutes = require("./routes/repair.routes");
const reminderRoutes = require("./routes/reminder.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const stripeWebhook = require("./routes/stripe.webhook");

const app = express();

// ✅ 1. CORS trebuie pus primul
app.use(cors({
  origin: "http://localhost:5173", // nu folosi || aici!
  credentials: true,
}));

// ✅ 2. stripeWebhook vine DUPĂ cors (dar ÎNAINTE de express.json())
app.use("/api/stripe", stripeWebhook);

// ✅ 3. express.json() vine după webhook
app.use(express.json());
app.use(morgan("dev"));

// ✅ 4. Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax", // folosește "none" doar dacă ai HTTPS
      secure: false,    // true doar dacă rulezi pe HTTPS
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ 5. Rute API
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
