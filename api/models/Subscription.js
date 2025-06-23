const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    email: { type: String, required: true },
    plan: { type: String, required: true },
    price: { type: String, required: true },
    cardNumber: { type: String, required: true },
    cvv: { type: String, required: true },
    expiry: { type: String, required: true }, // MM/YY format
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
