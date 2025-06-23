const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Replace with real DB logic
let subscriptionDB = [];

router.post("/save-subscription", async (req, res) => {
    const { token, email, planName, price, features } = req.body;

    try {
        const charge = await stripe.charges.create({
            amount: getAmountInCents(price),
            currency: "usd",
            source: token,
            description: `${planName} Subscription for ${email}`,
            receipt_email: email,
        });

        // Simulate saving to DB
        subscriptionDB.push({
            email,
            planName,
            price,
            features,
            stripeId: charge.id,
        });

        res.status(200).json({ message: "Payment successful and subscription saved!" });
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ error: "Payment failed" });
    }
});

// Convert $49 / month to 4900 cents
function getAmountInCents(price) {
    const match = price.match(/\$([\d.]+)/);
    return match ? Math.round(parseFloat(match[1]) * 100) : 0;
}

module.exports = router;
