const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");

// Route to create a new subscription
router.post("/", async (req, res) => {
    const { email, plan, price, cardNumber, cvv, expiry } = req.body;

    try {
        // Check if the user already has a subscription
        const existingSubscription = await Subscription.findOne({ email });
        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: "User already has an active subscription."
            });
        }

        // Create new subscription
        const newSubscription = new Subscription({
            email,
            plan,
            price,
            cardNumber,
            cvv,
            expiry,
        });

        await newSubscription.save();

        res.json({
            success: true,
            message: "Subscription saved successfully.",
        });
    } catch (err) {
        console.error("Subscription Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
});

// Route to check if the user has an active subscription
router.get("/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const subscription = await Subscription.findOne({ email });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "No active subscription found for this user."
            });
        }

        res.json({
            success: true,
            subscription: {
                plan: subscription.plan,
                price: subscription.price,
                cardNumber: subscription.cardNumber,
                expiry: subscription.expiry,
                active: true,
            }
        });
    } catch (err) {
        console.error("Error checking subscription:", err);
        res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
});


router.get("/:email", async (req, res) => {
    const { email } = req.params;
  
    try {
      const subscription = await Subscription.findOne({ email });
  
      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "No active subscription found for this user.",
        });
      }
  
      res.json({
        success: true,
        subscription: {
          plan: subscription.plan,
          price: subscription.price,
          cardNumber: subscription.cardNumber,
          expiry: subscription.expiry,
          createdAt: subscription.createdAt,
        },
      });
    } catch (err) {
      console.error("Error fetching subscription:", err);
      res.status(500).json({
        success: false,
        message: "Server error.",
      });
    }
  });  

module.exports = router;
