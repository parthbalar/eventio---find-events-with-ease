const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const {verifyUser} = require("../middleware/authMiddleware");

const router = express.Router();


//  Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//  Create Event (With Image Upload Support)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const eventData = {
      title: req.body.title,
      description: req.body.description,
      organizedBy: req.body.organizedBy,
      eventDate: req.body.eventDate,
      eventTime: req.body.eventTime,
      address: req.body.address,
      location: req.body.location,
      ticketPrice: req.body.ticketPrice,
      category: req.body.category,
      imageUrl: `/uploads/${req.file.filename}`,
      organizerEmail : req.body.organizerEmail 
    };

    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//  Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Get Event by ID (With Validation)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Event ID" });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  Update Event (With Optional Image Upload)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//  Get Event by Name
router.get("/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const event = await Event.findOne({ title: name });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//  Update Event
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//  Delete Event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ordersummary
router.get("/:id/ordersummary", async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);
      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      res.json({
          _id: event._id,
          title: event.title,
          ticketPrice: event.ticketPrice
      });
  } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Server error" });
  }
});

// payment mode
router.get("/:id/ordersummary/paymentsummary", async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);
      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      res.json({
          _id: event._id,
          title: event.title,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
          ticketPrice: event.ticketPrice
      });
  } catch (error) {
      console.error("Error fetching event details:", error);
      res.status(500).json({ message: "Server error" });
  }
});

router.get("/events", async (req, res) => {
  try {
    const { organizedBy } = req.query;

    if (!organizedBy) {
      return res.status(400).json({ error: "Missing organizedBy parameter" });
    }

    // console.log("Fetching events for:", organizedBy); // Debugging log

    const events = await Event.find({ organizedBy });

    if (!events.length) {
      return res.status(404).json({ message: "No events found" });
    }

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get All Events or Search Events
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } }, // Case-insensitive search in title
          { description: { $regex: search, $options: "i" } }, // Case-insensitive search in description
        ],
      };
    }

    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
