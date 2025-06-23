const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

const router = express.Router();

// Get All Reviews (For All Events)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'username');
    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found" });
    }
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: error.message });
  }
});


router.get('/event/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    const reviews = await Review.find({ eventId: req.params.id }).populate('user', 'username');
    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this event' });
    }
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/:eventid/review", async (req, res) => {
  const { eventid } = req.params;
  const { user, rating, comment } = req.body;

  try {
    //  Get the ticket for this user + event
    const ticket = await Ticket.findOne({ eventid, userid: user });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found for this user and event" });
    }

    // Extract name and eventname from ticketDetails
    const name = ticket.ticketDetails.name;
    const eventname = ticket.ticketDetails.eventname;

    const newReview = new Review({
      eventid,
      user,
      rating,
      comment,
      name,
      eventname,
    });

    await newReview.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
