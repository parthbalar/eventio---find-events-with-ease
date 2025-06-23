const express = require("express");
const Ticket = require("../../models/Ticket");

const router = express.Router();

// Get all tickets (admin use)
router.get("/ticket", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching all tickets:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete ticket by ID
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
