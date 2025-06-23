
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    email: { type: String, required: true },
    plan: { type: String, required: true },
    price: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
