const express = require("express");
const TicketModel = require("../models/Ticket");

const router = express.Router();

//  Create a Ticket
router.post("/", async (req, res) => {
  try {

    const {
      userid,
      eventid,
      ticketDetails: {
        name,
        email,
        eventname,
        eventdate,
        eventtime,
        ticketprice,
        qr,
        selectedSeats,
        tickets
      }
    } = req.body;

    const ticket = new TicketModel({
      userid,
      eventid,
      ticketDetails: {
        name,
        email,
        eventname,
        eventdate,
        eventtime,
        ticketprice,
        qr,
        selectedSeats,
        tickets
      }
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

//  Get all tickets for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const tickets = await TicketModel.find({ userid: userId });

    if (tickets.length === 0) {
      return res.status(404).json({ error: "No tickets found for this user" });
    }

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

//  Fetch all email IDs from a user's tickets
router.get("/user/:userId/email", async (req, res) => {
  try {
    const userId = req.params.userId;

    const tickets = await TicketModel.find({ userid: userId });

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ error: "No tickets found for this user" });
    }

    const userEmails = tickets.map(ticket => ticket.ticketDetails?.email);
    res.json({ emails: userEmails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

//  Delete a Ticket by ID
router.delete("/:ticketId", async (req, res) => {
  try {
    await TicketModel.findByIdAndDelete(req.params.ticketId);
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});


//  Get all booked seats for a specific event
router.get("/event/:eventId/seats", async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Fetch all tickets for the given event
    const tickets = await TicketModel.find({ eventid: eventId });

    // Extract all selected seats from the tickets
    const bookedSeats = tickets.flatMap(ticket => ticket.ticketDetails.selectedSeats);

    if (bookedSeats.length === 0) {
      return res.status(404).json({ message: "No booked seats found for this event" });
    }

    res.json({ bookedSeats });
  } catch (error) {
    console.error("Error fetching booked seats:", error);
    res.status(500).json({ error: "Failed to fetch booked seats" });
  }
});

module.exports = router;
