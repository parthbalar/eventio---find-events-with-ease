const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserModel = require('../models/User'); // Consistent import

//  Get User by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    // Find user in the database
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Get Email by User ID
router.get("/email/:userid", async (req, res) => {
  try {
    // Validate User ID
    if (!mongoose.Types.ObjectId.isValid(req.params.userid)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    // Find user and return only email
    const user = await UserModel.findById(req.params.userid, 'email'); // Only fetch email
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ email: user.email });
  } catch (error) {
    console.error("Error fetching email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
