const express = require("express");
const ContactMessage = require("../models/ContactMessage");

const router = express.Router();

// Contact form submission route
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new ContactMessage({ name, email, message });

    await newMessage.save();
    res.status(201).json({ success: true, message: "Message received!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to save message" });
  }
});

// Fetch all contact messages
router.get("/", async (req, res) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

module.exports = router;
