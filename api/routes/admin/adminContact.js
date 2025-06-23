const express = require('express');
const router = express.Router();

const ContactMessage = require('../../models/ContactMessage'); 

// GET all contact form messages
router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }); 
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

// DELETE an event by ID (admin)
router.delete('/contact-messages/:id', async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete Contact' });
  }
});


module.exports = router;