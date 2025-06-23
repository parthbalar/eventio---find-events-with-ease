const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizedBy: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  organizerEmail: {type:String ,required:true}, // 🔥 Ensure this matches backend upload
});

module.exports = mongoose.model("Event", EventSchema);
