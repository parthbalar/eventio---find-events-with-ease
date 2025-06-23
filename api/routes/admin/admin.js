const express = require('express');
const router = express.Router();
const Event = require('../../models/Event'); 
const User = require('../../models/User'); 
const Ticket = require('../../models/Ticket');
const ContactMessage = require('../../models/ContactMessage'); 

router.get('/stats', async (req, res) => {
  try {
    const eventCount = await Event.countDocuments();
    const userCount = await User.countDocuments();
    const contactCount = await ContactMessage.countDocuments();
    const ticketCount = await Ticket.countDocuments();

    res.json({ events: eventCount, users: userCount, contacts: contactCount, tickets: ticketCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;