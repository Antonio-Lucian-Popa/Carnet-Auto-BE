const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// folosit pentru a verifica semnătura Stripe
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Verificăm tipul evenimentului
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const planId = session.metadata.planId;

    try {
      // actualizăm userul cu noul plan
      await prisma.user.update({
        where: { id: userId },
        data: { planId },
      });

      console.log(`✅ User ${userId} a fost upgradat la planul ${planId}`);
    } catch (err) {
      console.error("Failed to update user plan:", err);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;
