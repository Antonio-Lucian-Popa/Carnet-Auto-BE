const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany();
    res.json(plans);
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createStripeCheckout = async (req, res) => {
  const { planId } = req.body;
  const userId = req.user.id;

  try {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) return res.status(404).json({ error: "Plan not found" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: `CarnetAuto - ${plan.name} Plan`,
          },
          unit_amount: Math.round(plan.price * 100), // în cenți
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId,
        planId,
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
